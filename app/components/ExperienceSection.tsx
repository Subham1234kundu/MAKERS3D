'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register plugin once outside components where possible or inside a dedicated file
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

const services = [
    {
        title: 'Custom Fabrication',
        description: 'Have a specific STL file or just an idea? We bring bespoke 3D designs to life with industrial precision.',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mb-4">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        )
    },
    {
        title: 'Material Science',
        description: 'From biodegradable PLA to high-strength PETG and aesthetic Silk finishes, we select the perfect resin for your use case.',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mb-4">
                <path d="M12 22a10 10 0 100-20 10 10 0 000 20z" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        )
    },
    {
        title: 'Rapid Prototyping',
        description: 'Accelerate your development cycle. We offer fast turnarounds for architecture, engineering, and product mockups.',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mb-4">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        )
    },
    {
        title: 'Post-Processing',
        description: 'Professional sanding, priming, and painting services to transform raw 3D prints into gallery-ready masterpieces.',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mb-4">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        )
    }
];

export default function ExperienceSection() {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        // Refresh ScrollTrigger to calculate correct positions after page load
        const refreshTimer = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 100);

        const ctx = gsap.context(() => {
            // 1. One-Time ENTRANCE REVEAL (Triggered once when the section comes into view)
            const entranceTl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            });

            entranceTl.fromTo('.title-line',
                { y: '100%', rotateX: -30, opacity: 0 },
                { y: 0, rotateX: 0, opacity: 1, duration: 1.2, stagger: 0.15, ease: 'expo.out' }
            )
                .fromTo('.experience-sub-desc',
                    { opacity: 0, y: 30 },
                    { opacity: 1, y: 0, duration: 1, ease: 'power3.out' },
                    '-=0.8'
                )
                .fromTo('.industrial-data > div',
                    { opacity: 0, x: -20 },
                    { opacity: 1, x: 0, stagger: 0.1, duration: 0.8, ease: 'power2.out' },
                    '-=1'
                )
                .fromTo('.feature-card',
                    { opacity: 0, y: 60, scale: 0.95 },
                    {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        stagger: 0.15,
                        duration: 1.2,
                        ease: 'expo.out',
                        clearProps: 'transform,opacity' // Ensure hover cards remain interactive
                    },
                    '-=0.8'
                )
                .fromTo('.stat-box',
                    { opacity: 0, y: 40 },
                    { opacity: 1, y: 0, stagger: 0.1, duration: 1, ease: 'power3.out' },
                    '-=1'
                );

            // 2. CONTINUOUS PARALLAX (Scrubbed movement based on scroll position)
            const parallaxTl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1,
                    invalidateOnRefresh: true,
                }
            });

            parallaxTl.fromTo('.experience-hero-img',
                { y: -30, scale: 1.1 },
                { y: 30, scale: 1, ease: 'none' },
                0
            );

            parallaxTl.fromTo('.experience-text-layer',
                { y: 100 },
                { y: -100, ease: 'none' },
                0
            );

            parallaxTl.fromTo('.experience-side-text',
                { y: 300 },
                { y: -300, ease: 'none' },
                0
            );

            // Subtle background pulse
            gsap.to('.experience-glow', {
                opacity: 0.05,
                scale: 1.2,
                duration: 5,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            });
        }, sectionRef);

        return () => {
            clearTimeout(refreshTimer);
            ctx.revert();
        };
    }, []);

    return (
        <section ref={sectionRef} className="bg-black py-20 sm:py-32 border-t border-white/5 overflow-hidden relative" suppressHydrationWarning>
            {/* Decorative background blueprint grid - specific to this section */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10" suppressHydrationWarning>

                {/* Layered Hero Content */}
                <div className="relative mb-24 sm:mb-40 group" suppressHydrationWarning>

                    {/* Floating Vertical Decorative Text - Desktop Only */}
                    <div className="absolute -left-12 top-0 h-full hidden lg:flex flex-col justify-center pointer-events-none overflow-hidden">
                        <span className="experience-side-text text-[120px] font-black text-white/[0.02] rotate-90 origin-left whitespace-nowrap uppercase tracking-tighter">
                            PRECISION CRAFTING
                        </span>
                    </div>

                    <div className="flex flex-col lg:flex-row items-end gap-0 lg:gap-12 relative">
                        {/* The Large Image Container */}
                        <div className="experience-image-wrapper relative w-full lg:w-[85%] aspect-[16/10] sm:aspect-[21/9] lg:aspect-video rounded-2xl sm:rounded-[2rem] overflow-hidden border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.8)]">
                            <img
                                src="/crafting-experience.png"
                                alt="CRAFTING PROCESS"
                                className="experience-hero-img w-full h-full object-cover grayscale brightness-[0.4] group-hover:brightness-75 transition-[filter] duration-1000"
                            />
                            {/* Inner vignette and gradients */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-black via-transparent to-transparent opacity-90"></div>
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black"></div>

                            {/* Decorative industrial lines inside image */}
                            <div className="industrial-data absolute top-8 right-8 text-[9px] sm:text-[10px] font-mono text-white/40 tracking-tighter text-right hidden sm:block z-10 backdrop-blur-sm bg-black/10 p-2 rounded border border-white/5">
                                <div>[X: 42.921 // Y: 11.002]</div>
                                <div>PRECISION_LAYER: 0.02MM</div>
                                <div>STATUS: EXTRUDING_VISION</div>
                            </div>
                        </div>

                        {/* Overlapping Text - Content that 'touches' and layers over image */}
                        <div className="experience-text-layer relative lg:absolute lg:right-0 lg:bottom-0 w-full lg:w-[48%] mt-[-30px] sm:mt-[-50px] lg:mt-0 px-4 sm:px-0 z-20 pointer-events-none">
                            <h2 className="experience-main-title text-6xl sm:text-7xl lg:text-9xl font-thin tracking-tighter text-white uppercase leading-[0.8] mb-2 cursor-none pointer-events-auto"
                                data-cursor-size="large">
                                <span className="block overflow-hidden">
                                    <span className="title-line block">THE</span>
                                </span>
                                <span className="block overflow-hidden">
                                    <span className="title-line italic block ml-4 sm:ml-8 font-light text-white/90">MAKERS</span>
                                </span>
                                <span className="block overflow-hidden">
                                    <span className="title-line block text-right -mt-1 sm:-mt-3 mr-4 sm:mr-8 font-extrabold text-white">EXPERIENCE</span>
                                </span>
                            </h2>
                            <div className="mt-6 sm:mt-10 flex flex-col items-end text-right">
                                <p className="experience-sub-desc text-white/70 font-light text-[10px] sm:text-xs tracking-[0.25em] uppercase max-w-[280px] sm:max-w-sm leading-relaxed translate-y-2 opacity-0">
                                    Elevating digital concepts into physical reality. Precision engineered, unparalleled craftsmanship.
                                </p>
                                <div className="h-10 w-[1px] bg-gradient-to-b from-white/40 to-transparent mt-6 mr-4 animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4 Service Dynamic Boxes - Row Layout on Desktop */}
                <div className="services-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 relative z-30 mb-12 sm:mb-16" suppressHydrationWarning>
                    {services.map((service, index) => (
                        <div key={index}
                            className="feature-card group relative p-6 sm:p-10 bg-white/[0.03] border border-white/10 hover:border-white/30 transition-[border-color,background-color,transform] duration-500 rounded-[2.5rem] overflow-hidden"
                            suppressHydrationWarning>
                            <div className="absolute -right-2 -top-2 text-6xl font-black text-white/[0.03] select-none">
                                0{index + 1}
                            </div>
                            <div className="relative z-10">
                                <div className="text-white/60 group-hover:text-white transition-colors duration-500 mb-6 group-hover:scale-110 origin-left inline-block">
                                    {service.icon}
                                </div>
                                <h3 className="text-white text-base sm:text-lg font-bold tracking-tight uppercase mb-3">{service.title}</h3>
                                <p className="text-white/60 font-light text-[11px] sm:text-xs leading-relaxed tracking-wide group-hover:text-white/90 transition-colors duration-500">
                                    {service.description}
                                </p>
                            </div>

                            {/* Decorative corner accent */}
                            <div className="absolute bottom-0 left-0 w-8 h-[1px] bg-white/20"></div>
                            <div className="absolute bottom-0 left-0 w-[1px] h-8 bg-white/20"></div>
                        </div>
                    ))}
                </div>

                {/* New 4 Stat/Feature Divs in a Row */}
                <div className="stats-row grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 mb-20 relative z-30" suppressHydrationWarning>
                    {[
                        { label: 'Precision', value: '0.02MM', detail: 'Layer Height' },
                        { label: 'Materials', value: '15+', detail: 'Industry Grade' },
                        { label: 'Production', value: '24/7', detail: 'Rapid Delivery' },
                        { label: 'Finish', value: 'PRO', detail: 'Post-Processed' }
                    ].map((stat, i) => (
                        <div key={i} className="stat-box flex flex-col items-center justify-center p-8 bg-white/[0.02] border border-white/[0.05] rounded-3xl text-center group hover:bg-white/[0.04] transition-all duration-500">
                            <span className="text-white/30 text-[9px] font-bold tracking-[0.3em] uppercase mb-2">{stat.label}</span>
                            <span className="text-white text-3xl font-black mb-1 tracking-tighter">{stat.value}</span>
                            <span className="text-white/50 text-[10px] uppercase tracking-widest">{stat.detail}</span>
                        </div>
                    ))}
                </div>

                {/* Final Call to Action with enhanced micro-interaction */}
                <div className="mt-20 sm:mt-32 text-center" suppressHydrationWarning>
                    <a
                        href="/customorder"
                        className="experience-cta inline-flex items-center gap-6 text-[10px] sm:text-xs font-black tracking-[0.5em] text-white/60 hover:text-white uppercase transition-all duration-500 group"
                    >
                        <span className="relative">
                            Start Your Creation
                            <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-white transition-all duration-700 group-hover:w-full"></span>
                        </span>
                        <div className="w-10 h-10 flex items-center justify-center group-hover:translate-x-2 transition-all duration-500">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M5 12h14m-7-7l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </a>
                </div>
            </div>

            {/* Subtle background industrial elements */}
            <div className="absolute top-0 right-0 w-1/3 h-full border-r border-white/[0.02] pointer-events-none"></div>
            <div className="experience-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.02] blur-[150px] rounded-full pointer-events-none"></div>
        </section>
    );
}
