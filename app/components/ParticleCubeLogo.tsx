'use client';

import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleCubeProps {
    isHovered: boolean;
}

function ParticleCube({ isHovered }: ParticleCubeProps) {
    const pointsRef = useRef<THREE.Points>(null);

    // Create particles in a cube formation
    const particles = useMemo(() => {
        const temp = [];
        const particleCount = 300; // Reduced from 1000

        // Create cube edges with particles
        for (let i = 0; i < particleCount; i++) {
            const t = Math.random();
            const edge = Math.floor(Math.random() * 12); // 12 edges in a cube

            let x = 0, y = 0, z = 0;
            const size = 1.2; // Smaller cube (was 1.5)

            // Define the 12 edges of the cube
            switch (edge) {
                // Bottom face edges
                case 0: x = -size + t * size * 2; y = -size; z = -size; break;
                case 1: x = size; y = -size; z = -size + t * size * 2; break;
                case 2: x = size - t * size * 2; y = -size; z = size; break;
                case 3: x = -size; y = -size; z = size - t * size * 2; break;

                // Top face edges
                case 4: x = -size + t * size * 2; y = size; z = -size; break;
                case 5: x = size; y = size; z = -size + t * size * 2; break;
                case 6: x = size - t * size * 2; y = size; z = size; break;
                case 7: x = -size; y = size; z = size - t * size * 2; break;

                // Vertical edges
                case 8: x = -size; y = -size + t * size * 2; z = -size; break;
                case 9: x = size; y = -size + t * size * 2; z = -size; break;
                case 10: x = size; y = -size + t * size * 2; z = size; break;
                case 11: x = -size; y = -size + t * size * 2; z = size; break;
            }

            // Less randomness for cleaner, more perfect edges
            x += (Math.random() - 0.5) * 0.03;
            y += (Math.random() - 0.5) * 0.03;
            z += (Math.random() - 0.5) * 0.03;

            temp.push(x, y, z);
        }

        return new Float32Array(temp);
    }, []);

    // Animate rotation - speed up when hovered
    useFrame((state) => {
        if (pointsRef.current) {
            const speed = isHovered ? 3.5 : 0.2; // 17.5x faster on hover
            pointsRef.current.rotation.x = state.clock.elapsedTime * speed;
            pointsRef.current.rotation.y = state.clock.elapsedTime * (speed * 1.5);

            // Move away (zoom out) on hover
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
                size={0.15}
                color="#ffffff"
                sizeAttenuation={true}
                transparent={true}
                opacity={0.8}
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
            <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <ParticleCube isHovered={isHovered} />
            </Canvas>
        </div>
    );
}
