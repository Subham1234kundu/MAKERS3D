'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import type { RefObject } from 'react';
import { DoubleSide, Group, LatheGeometry, Mesh, MeshStandardMaterial, OrthographicCamera, Plane, Vector2, Vector3 } from 'three';

export type PrintFrame = { blend: number };
type Props = { active: boolean; playback: 'auto' | 'scroll'; progress: RefObject<number>; onFrame: (frame: PrintFrame) => void; onComplete: () => void; onReady: () => void; onUnavailable: () => void };
const HEIGHT = 2.3;
const BASE = 0.13;
const PRINT_DURATION = 9.7;
const smooth = (value: number) => { const t = Math.max(0, Math.min(1, value)); return t * t * (3 - 2 * t); };
const radiusAt = (t: number) => 0.36 + 0.28 * Math.pow(Math.sin(Math.PI * t), 0.7) - 0.2 * Math.exp(-Math.pow((t - 0.76) / 0.18, 2)) + 0.03 * t;

export default function HeroPrintScene(props: Props) {
  return (
    <Canvas
      orthographic
      camera={{ position: [4, 3.5, 6], near: 0.1, far: 40 }}
      dpr={[1, 1.5]}
      frameloop={props.active ? 'always' : 'demand'}
      gl={{ alpha: true, antialias: true, localClippingEnabled: true }}
      fallback={null}
      onCreated={props.onReady}
    >
      <ambientLight intensity={1.8} />
      <directionalLight position={[-3, 6, 4]} intensity={3} />
      <directionalLight position={[4, 2, -2]} intensity={1.2} />
      <ContextStatus onUnavailable={props.onUnavailable} />
      <PrintObject {...props} />
    </Canvas>
  );
}

function ContextStatus({ onUnavailable }: Pick<Props, 'onUnavailable'>) {
  const gl = useThree(state => state.gl);
  useEffect(() => {
    const canvas = gl.domElement;
    canvas.addEventListener('webglcontextlost', onUnavailable, { once: true });
    return () => canvas.removeEventListener('webglcontextlost', onUnavailable);
  }, [gl, onUnavailable]);
  return null;
}

function PrintObject({ active, playback, progress, onFrame, onComplete }: Props) {
  const product = useRef<Mesh>(null);
  const ghost = useRef<Mesh>(null);
  const head = useRef<Group>(null);
  const gantry = useRef<Group>(null);
  const material = useRef<MeshStandardMaterial>(null);
  const { camera, size } = useThree();
  const plane = useMemo(() => new Plane(new Vector3(0, -1, 0), BASE), []);
  const clippingPlanes = useMemo(() => [plane], [plane]);
  const geometry = useMemo(() => {
    const points: Vector2[] = [];
    for (let i = 0; i <= 96; i++) {
      const t = i / 96;
      points.push(new Vector2(radiusAt(t), t * HEIGHT));
    }
    for (let i = 96; i >= 3; i--) {
      const t = i / 96;
      points.push(new Vector2(radiusAt(t) - 0.035, t * HEIGHT));
    }
    points.push(new Vector2(0, 0.07), new Vector2(0, 0), points[0].clone());
    const shape = new LatheGeometry(points, 72);
    const positions = shape.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i), z = positions.getZ(i), t = positions.getY(i) / HEIGHT;
      const ribs = 1 + 0.045 * Math.cos(18 * Math.atan2(z, x) - t * Math.PI * 2);
      const layers = 1 + 0.002 * Math.sin(t * Math.PI * 380);
      positions.setXYZ(i, x * ribs * layers, positions.getY(i), z * ribs * layers);
    }
    shape.computeVertexNormals();
    return shape;
  }, []);

  useEffect(() => {
    const ortho = camera as OrthographicCamera;
    ortho.zoom = size.height / 4;
    ortho.lookAt(0, 1.35, 0);
    ortho.updateProjectionMatrix();
  }, [camera, size.height]);
  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((_, delta) => {
    if (!active) return;
    // Desktop advances with time; mobile advances only with scrolling.
    if (playback === 'auto') progress.current = Math.min(1, progress.current + Math.min(delta, 0.1) / PRINT_DURATION);
    const time = Math.max(0, Math.min(1, progress.current)) * PRINT_DURATION;
    const printing = Math.max(0, Math.min(1, (time - 2) / 6.5));
    const blend = smooth((time - 8.5) / 1.2);
    plane.constant = BASE + Math.max(0.015, printing * HEIGHT);
    if (product.current) product.current.visible = time >= 2;
    if (ghost.current) ghost.current.visible = time < 8.5;
    if (material.current) material.current.opacity = 1;
    if (head.current) {
      head.current.visible = time >= 2 && time < 8.5;
      const angle = (time - 2) * 9;
      const radius = radiusAt(printing) * 0.92;
      head.current.position.set(Math.cos(angle) * radius, plane.constant + 0.12, Math.sin(angle) * radius);
    }
    if (gantry.current) {
      gantry.current.visible = time < 9.5;
      gantry.current.position.y = plane.constant + 0.4;
    }
    onFrame({ blend });
    if (progress.current >= 1) onComplete();
  });

  return (
    <group>
      <mesh position={[0, BASE, 0]} geometry={geometry} ref={product}>
        <meshStandardMaterial ref={material} color="#c97850" roughness={0.82} metalness={0.02} side={DoubleSide} clippingPlanes={clippingPlanes} />
      </mesh>
      <mesh ref={ghost} position={[0, BASE, 0]} geometry={geometry}>
        <meshBasicMaterial color="#8a8a8a" wireframe transparent opacity={0.12} />
      </mesh>
      <mesh position={[0, 0.055, 0]}>
        <boxGeometry args={[2.35, 0.11, 1.95]} />
        <meshStandardMaterial color="#dedfdf" roughness={0.8} />
      </mesh>
      {[-1.03, 1.03].map(x => (
        <mesh key={x} position={[x, 1.6, -0.7]}>
          <boxGeometry args={[0.055, 3.05, 0.055]} />
          <meshStandardMaterial color="#8c9194" metalness={0.65} roughness={0.4} />
        </mesh>
      ))}
      <group ref={gantry}>
        <mesh position={[0, 0, -0.7]}>
          <boxGeometry args={[2.1, 0.065, 0.065]} />
          <meshStandardMaterial color="#8c9194" metalness={0.65} roughness={0.4} />
        </mesh>
      </group>
      <group ref={head}>
        <mesh position={[0, 0.14, 0]}>
          <boxGeometry args={[0.22, 0.22, 0.19]} />
          <meshStandardMaterial color="#333638" roughness={0.55} />
        </mesh>
        <mesh rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.045, 0.09, 16]} />
          <meshStandardMaterial color="#b99459" metalness={0.65} roughness={0.4} />
        </mesh>
      </group>
    </group>
  );
}
