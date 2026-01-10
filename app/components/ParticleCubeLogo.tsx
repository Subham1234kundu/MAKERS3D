'use client';

import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleCubeProps {
    isHovered: boolean;
}

function ParticleCube({ isHovered }: ParticleCubeProps) {
    const pointsRef = useRef<THREE.Points>(null);

    const particles = useMemo(() => {
        const temp = [];
        // Reduce particles on mobile for better performance
        const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
        const particleCount = isMobile ? 150 : 300;

        for (let i = 0; i < particleCount; i++) {
            const t = Math.random();
            const edge = Math.floor(Math.random() * 12);

            let x = 0, y = 0, z = 0;
            const size = 1.2;

            switch (edge) {
                case 0: x = -size + t * size * 2; y = -size; z = -size; break;
                case 1: x = size; y = -size; z = -size + t * size * 2; break;
                case 2: x = size - t * size * 2; y = -size; z = size; break;
                case 3: x = -size; y = -size; z = size - t * size * 2; break;
                case 4: x = -size + t * size * 2; y = size; z = -size; break;
                case 5: x = size; y = size; z = -size + t * size * 2; break;
                case 6: x = size - t * size * 2; y = size; z = size; break;
                case 7: x = -size; y = size; z = size - t * size * 2; break;
                case 8: x = -size; y = -size + t * size * 2; z = -size; break;
                case 9: x = size; y = -size + t * size * 2; z = -size; break;
                case 10: x = size; y = -size + t * size * 2; z = size; break;
                case 11: x = -size; y = -size + t * size * 2; z = size; break;
            }

            x += (Math.random() - 0.5) * 0.03;
            y += (Math.random() - 0.5) * 0.03;
            z += (Math.random() - 0.5) * 0.03;

            temp.push(x, y, z);
        }

        return new Float32Array(temp);
    }, []);

    useFrame((state) => {
        if (pointsRef.current) {
            const speed = isHovered ? 3.5 : 0.2;
            pointsRef.current.rotation.x = state.clock.elapsedTime * speed;
            pointsRef.current.rotation.y = state.clock.elapsedTime * (speed * 1.5);

            const targetZ = isHovered ? 0.5 : 0;
            pointsRef.current.position.z += (targetZ - pointsRef.current.position.z) * 0.1;
        }
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[particles, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.16}
                color="#ffffff"
                sizeAttenuation={true}
                transparent={true}
                opacity={1}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
}

export default function ParticleCubeLogo() {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            style={{ width: '60px', height: '60px' }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }} gl={{ antialias: true }}>
                <ambientLight intensity={2} />
                <pointLight position={[10, 10, 10]} intensity={3} />
                <pointLight position={[-10, -10, -10]} intensity={1} color="#ffffff" />
                <ParticleCube isHovered={isHovered} />
            </Canvas>
        </div>
    );
}
