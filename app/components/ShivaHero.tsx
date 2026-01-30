'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, Sparkles, Stars, Float as FloatDrei } from '@react-three/drei';
import * as THREE from 'three';
import Link from 'next/link';
import Image from 'next/image';
import { gsap } from 'gsap';


function FlowingWire({ color = "white", speed = 0.4, index = 0 }) {
    const lineRef = useRef<any>(null);
    const count = 120; // Increased for extra smoothness and full-width span
    const points = useMemo(() => {
        const p = [];
        for (let i = 0; i < count; i++) {
            p.push(new THREE.Vector3(0, 0, 0));
        }
        return p;
    }, [count]);

    useFrame((state) => {
        if (!lineRef.current) return;
        const time = state.clock.getElapsedTime() * speed;
        const positions = lineRef.current.geometry.attributes.position;
        const mouseX = state.mouse.x * 4;
        const mouseY = state.mouse.y * 4;

        for (let i = 0; i < count; i++) {
            const offset = i * 0.08 + index; // Slower frequency for elegant flow at full width

            // Base wave motion - WIDENED TO FULL SPAN
            let x = (i - count / 2) * 0.45;
            let y = Math.sin(time + offset) * 2.5;
            let z = Math.cos(time * 0.6 + offset) * 2;

            // Add organic secondary motion for "nice flow"
            y += Math.sin(time * 0.4 + i * 0.03) * 1.2;
            z += Math.cos(time * 0.2 + i * 0.06) * 1.2;

            // Interactive "Moveable" part: React to mouse with smoother falloff
            const distFromMouse = Math.sqrt(Math.pow(state.mouse.x * 12 - x, 2) + Math.pow(state.mouse.y * 12 - y, 2));
            const mouseEffect = Math.max(0, 1 - distFromMouse / 15);

            y += mouseY * mouseEffect * 2.5;
            x += mouseX * mouseEffect * 1.5;
            z += (mouseX + mouseY) * mouseEffect * 1.5;

            positions.setXYZ(i, x, y, z);
        }
        positions.needsUpdate = true;
    });

    return (
        <line ref={lineRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[new Float32Array(count * 3), 3]}
                />
            </bufferGeometry>
            <lineBasicMaterial
                attach="material"
                color={color}
                transparent
                opacity={1}
                linewidth={3.5}
                blending={THREE.AdditiveBlending}
            />
        </line>
    );
}

function EtherealStrings() {
    return (
        <group>
            {[...Array(3)].map((_, i) => (
                <FlowingWire
                    key={i}
                    speed={0.15 + i * 0.05}
                    index={i * (Math.PI / 1.5)}
                    color="#ffffff"
                />
            ))}
        </group>
    );
}


export default function ShivaHero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const atmosphereRef = useRef<HTMLDivElement>(null);

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (!containerRef.current) return;

        let ctx: any;

        const setupScrollAnimations = async () => {
            const { ScrollTrigger } = await import('gsap/ScrollTrigger');
            gsap.registerPlugin(ScrollTrigger);

            ctx = gsap.context(() => {
                const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

                // Initial Entrance Animation
                gsap.set(imageRef.current, { scale: 1.1, filter: 'brightness(0) contrast(1.2)' });
                gsap.set(titleRef.current, { y: 60, opacity: 0 });
                gsap.set(overlayRef.current, { opacity: 0 });

                tl.to(imageRef.current, {
                    scale: 1,
                    filter: 'brightness(1) contrast(1)',
                    duration: 2.5,
                    ease: "expo.out"
                })
                    .to(titleRef.current, {
                        y: 0,
                        opacity: 1,
                        duration: 1.2,
                        stagger: 0.1
                    }, "-=1.8")
                    .to(overlayRef.current, {
                        opacity: 1,
                        duration: 1.2
                    }, "-=1.2");

                // --- Perfect Scroll Animation ---
                // Using a Master Timeline for synchronized scroll control
                const scrollTl = gsap.timeline({
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top top",
                        end: "bottom 20%",
                        scrub: 1,
                        invalidateOnRefresh: true
                    }
                });

                // 1. Image Parallax
                scrollTl.fromTo(imageRef.current,
                    { y: 0, scale: 1 },
                    { y: 120, scale: 1.08, ease: "none" },
                    0
                );

                // 2. Title & Content Fade Out (Refined)
                scrollTl.fromTo(overlayRef.current,
                    { y: 0, opacity: 1 },
                    { y: -180, opacity: 0, ease: "power2.inOut" },
                    0
                );

                // 3. Atmosphere (Stars/Strings) Deep Scroll
                scrollTl.fromTo(atmosphereRef.current,
                    { y: 0, scale: 1, opacity: 0.4 },
                    { y: -80, scale: 1.15, opacity: 0.1, ease: "none" },
                    0
                );
            }, containerRef);
        };

        setupScrollAnimations();

        // Subtle parallax on mouse move (Original)
        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const xPos = (clientX / window.innerWidth - 0.5) * 15;
            const yPos = (clientY / window.innerHeight - 0.5) * 15;

            if (imageRef.current) {
                gsap.to(imageRef.current, {
                    x: xPos,
                    y: yPos,
                    duration: 2,
                    ease: "power2.out",
                    overwrite: 'auto'
                });
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (ctx) ctx.revert();
        };
    }, []);

    return (
        <section ref={containerRef} className="relative w-full h-[105vh] bg-black overflow-hidden flex flex-col items-center justify-center select-none" suppressHydrationWarning>
            {/* 3D Atmosphere Layer */}
            <div ref={atmosphereRef} className="absolute inset-0 z-0 opacity-100" suppressHydrationWarning>
                {mounted && (
                    <Canvas
                        dpr={[1, 1.5]}
                        gl={{ powerPreference: "high-performance", antialias: false }}
                        suppressHydrationWarning
                    >
                        <PerspectiveCamera makeDefault position={[0, 0, 12]} />
                        <ambientLight intensity={0.1} />
                        <FloatDrei speed={1.5} rotationIntensity={0.2} floatIntensity={0.2}>
                            <EtherealStrings />
                        </FloatDrei>
                    </Canvas>
                )}

            </div>

            {/* Hero Image - Optimized for 'Perfect Top' */}
            <div className="absolute inset-0 z-10 w-full h-full overflow-hidden" suppressHydrationWarning>
                <div className="relative w-full h-full" ref={imageRef} suppressHydrationWarning>
                    <Image
                        src="/shiva_mandir_hero.png"
                        alt="Shiva Mandir Architectural Masterpiece"
                        fill
                        className="object-cover object-top sm:object-contain grayscale contrast-[1.1] brightness-[0.4] transition-transform duration-700 hover:grayscale-0 hover:scale-105"
                        priority
                        sizes="100vw"
                        quality={90}
                    />

                </div>




                {/* Advanced Lighting & Vignette */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black z-11 pointer-events-none" suppressHydrationWarning />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] z-11 opacity-70 pointer-events-none" suppressHydrationWarning />
            </div>

            {/* Content Layers */}
            <div ref={overlayRef} className="relative z-20 flex flex-col items-center justify-between h-full w-full py-24 opacity-0 pointer-events-none" suppressHydrationWarning>
                <div className="text-center px-6 mt-4 sm:mt-10" suppressHydrationWarning>
                    <div className="overflow-hidden mb-2" suppressHydrationWarning>
                        <span className="block text-white/20 text-[7px] sm:text-[9px] font-medium tracking-[1.5em] uppercase">
                            ESTABLISHED IN ETERNITY
                        </span>
                    </div>
                    <div className="overflow-visible" suppressHydrationWarning>
                        <h1 ref={titleRef} className="text-white text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extralight tracking-[-0.08em] leading-[0.85] flex flex-col items-center" suppressHydrationWarning>
                            <span className="opacity-40" suppressHydrationWarning>THE DIVINE</span>
                            <span className="font-black italic drop-shadow-[0_0_20px_rgba(255,255,255,0.2)] tracking-[-0.06em] mt-[-0.05em] px-2" suppressHydrationWarning>COLLECTION</span>
                        </h1>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-10 mb-12 pointer-events-auto" suppressHydrationWarning>
                    <p className="max-w-2xl text-center text-white/40 text-[10px] sm:text-xs tracking-[0.5em] uppercase leading-relaxed px-8 font-medium" suppressHydrationWarning>
                        Uncompromising Precision <span className="text-white/10 mx-4" suppressHydrationWarning>/</span> Ethereal Aesthetics <span className="text-white/10 mx-4" suppressHydrationWarning>/</span> Timeless Design
                    </p>

                    <Link
                        href="/products"
                        className="group relative px-14 py-5 bg-white text-black text-[9px] font-black tracking-[0.8em] uppercase rounded-full overflow-hidden transition-all duration-700 hover:scale-[1.03] active:scale-95 shadow-[0_0_0_0_rgba(255,255,255,0)] hover:shadow-[0_20px_80px_-10px_rgba(255,255,255,0.4)]"
                        suppressHydrationWarning
                    >
                        <span className="relative z-10 transition-transform duration-700 block group-hover:translate-x-1">
                            EXPLORE COLLECTION
                        </span>

                        <div className="absolute inset-0 bg-[#f8f8f8] translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[0.23,1,0.32,1]" suppressHydrationWarning />

                        <div className="absolute top-0 -left-[100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/80 to-transparent skew-x-[-25deg] transition-all duration-1000 group-hover:left-[150%] pointer-events-none" suppressHydrationWarning />
                    </Link>
                </div>

                {/* Micro Details: Film Grain & Scanlines */}
                <div className="absolute inset-0 z-30 pointer-events-none mix-blend-overlay opacity-[0.08] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" suppressHydrationWarning />
                <div className="absolute inset-0 z-40 pointer-events-none opacity-[0.02] bg-[linear-gradient(rgba(255,255,255,0)_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px]" suppressHydrationWarning />

                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-3 opacity-30" suppressHydrationWarning>
                    <div className="w-[1px] h-16 bg-gradient-to-b from-white via-white/50 to-transparent" suppressHydrationWarning />
                    <span className="text-[7px] text-white tracking-[0.6em] uppercase font-bold" suppressHydrationWarning>Divine Scroll</span>
                </div>
            </div>
        </section>
    );
}
