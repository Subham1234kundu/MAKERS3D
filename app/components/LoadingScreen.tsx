'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { gsap } from 'gsap';

const ParticleCubeLogo = dynamic(() => import('./ParticleCubeLogo'), {
    ssr: false,
    loading: () => <div style={{ width: '80px', height: '80px' }} />
});

export default function LoadingScreen() {
    const [isLoading, setIsLoading] = useState(true);
    const screenRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const cubeContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Prevent scrolling while loading screen is active
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';

        // Entrance animation for the whole container to ensure cube doesn't "pop"
        gsap.fromTo(cubeContainerRef.current,
            { opacity: 0, scale: 0.8, filter: 'blur(10px)' },
            { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1.5, ease: 'power3.out', delay: 0.2 }
        );

        // Handle loading transition
        const timer = setTimeout(() => {
            const tl = gsap.timeline({
                onComplete: () => {
                    setIsLoading(false);
                    // Restore scrolling after transition
                    document.documentElement.style.overflow = '';
                    document.body.style.overflow = '';
                }
            });

            tl.to([cubeContainerRef.current, progressRef.current], {
                opacity: 0,
                y: -20,
                duration: 0.8,
                ease: 'power3.inOut'
            })
                .to(screenRef.current, {
                    opacity: 0,
                    duration: 1,
                    ease: 'power4.inOut'
                }, '-=0.4');
        }, 3500); // 3.5 seconds to account for 3D initialization

        // Animate the loading dash - synchronized with cube entrance
        if (progressRef.current) {
            gsap.fromTo(progressRef.current,
                { scaleX: 0 },
                { scaleX: 1, duration: 3.2, ease: 'power2.inOut', delay: 0.3 }
            );
        }

        return () => clearTimeout(timer);
    }, []);

    if (!isLoading) return null;

    return (
        <div
            ref={screenRef}
            className="fixed inset-0 z-[99999] bg-black flex flex-col items-center justify-center"
        >
            <div className="flex flex-col items-center translate-y-12">
                <div ref={cubeContainerRef} className="mb-4">
                    <ParticleCubeLogo />
                </div>

                <div className="w-24 h-[1px] bg-white/10 relative overflow-hidden">
                    <div
                        ref={progressRef}
                        className="absolute inset-0 bg-white origin-left"
                    />
                </div>

                <p className="mt-6 text-[10px] uppercase tracking-[0.6em] text-white/30 animate-pulse">
                    Initializing Studio
                </p>
            </div>

            <style jsx>{`
                @keyframes pulse {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 0.6; }
                }
                .animate-pulse {
                    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
            `}</style>
        </div>
    );
}
