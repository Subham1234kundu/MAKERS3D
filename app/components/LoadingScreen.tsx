'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { gsap } from 'gsap';

const ParticleCubeLogo = dynamic(() => import('./ParticleCubeLogo'), {
    ssr: false,
    loading: () => (
        <div style={{ width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
                width: '40px',
                height: '40px',
                border: '2px solid rgba(255,255,255,0.1)',
                borderTop: '2px solid white',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite'
            }} />
        </div>
    )
});

export default function LoadingScreen() {
    const [isLoading, setIsLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const screenRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const cubeContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Check if mobile
        const checkMobile = window.innerWidth < 768;
        setIsMobile(checkMobile);

        // Prevent scrolling while loading screen is active
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';

        // Faster entrance animation for mobile
        const entranceDuration = checkMobile ? 0.8 : 1.5;
        const entranceDelay = checkMobile ? 0.1 : 0.2;

        gsap.fromTo(cubeContainerRef.current,
            { opacity: 0, scale: 0.8, filter: 'blur(10px)' },
            { opacity: 1, scale: 1, filter: 'blur(0px)', duration: entranceDuration, ease: 'power3.out', delay: entranceDelay }
        );

        // Much shorter loading time for mobile (no 3D rendering)
        const loadingDuration = checkMobile ? 1200 : 2500;

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
                duration: checkMobile ? 0.5 : 0.8,
                ease: 'power3.inOut'
            })
                .to(screenRef.current, {
                    opacity: 0,
                    duration: checkMobile ? 0.6 : 1,
                    ease: 'power4.inOut'
                }, '-=0.4');
        }, loadingDuration);

        // Animate the loading dash - faster for mobile
        if (progressRef.current) {
            const progressDuration = checkMobile ? 1.6 : 2.2;
            gsap.fromTo(progressRef.current,
                { scaleX: 0 },
                { scaleX: 1, duration: progressDuration, ease: 'power2.inOut', delay: 0.2 }
            );
        }

        return () => clearTimeout(timer);
    }, []);

    if (!isLoading) return null;

    return (
        <div
            ref={screenRef}
            className="fixed inset-0 z-[99999] bg-black flex flex-col items-center justify-center"
            suppressHydrationWarning
        >
            <div className="flex flex-col items-center translate-y-12" suppressHydrationWarning>
                <div ref={cubeContainerRef} className="mb-4" suppressHydrationWarning>
                    <ParticleCubeLogo />
                </div>

                <div className="w-24 h-[1px] bg-white/10 relative overflow-hidden" suppressHydrationWarning>
                    <div
                        ref={progressRef}
                        className="absolute inset-0 bg-white origin-left"
                        suppressHydrationWarning
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
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-pulse {
                    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
            `}</style>
        </div>
    );
}
