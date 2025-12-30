'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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
    }
];

export default function ExperienceSection() {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.feature-card', {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 80%',
                },
                y: 30,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                ease: 'power3.out'
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="bg-black py-24 px-8 border-t border-white/5 overflow-hidden relative" suppressHydrationWarning>
            <div className="max-w-7xl mx-auto relative z-10" suppressHydrationWarning>
                <div className="text-center mb-20" suppressHydrationWarning>
                    <h2 className="text-3xl md:text-5xl font-thin tracking-tighter mb-6 uppercase">
                        The <span className="italic font-light">Makers</span> Experience
                    </h2>
                    <p className="text-white/40 font-thin text-sm md:text-base tracking-[0.2em] max-w-xl mx-auto uppercase">
                        Elevating digital concepts into physical reality.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12" suppressHydrationWarning>
                    {services.map((service, index) => (
                        <div key={index} className="feature-card group p-8 bg-white/[0.02] border border-white/5 hover:border-white/20 transition-all duration-500 rounded-2xl" suppressHydrationWarning>
                            <div className="text-white/40 group-hover:text-white transition-colors duration-500">
                                {service.icon}
                            </div>
                            <h3 className="text-white text-lg font-light tracking-widest uppercase mb-4">{service.title}</h3>
                            <p className="text-white/30 font-thin text-sm leading-relaxed tracking-wide group-hover:text-white/60 transition-colors duration-500">
                                {service.description}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-20 text-center" suppressHydrationWarning>
                    <a
                        href="/customorder"
                        className="inline-flex items-center gap-4 text-[10px] sm:text-xs font-bold tracking-[0.4em] text-white uppercase group hover:gap-6 transition-all duration-300"
                    >
                        <span>Start Your Creation</span>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M5 12h14m-7-7l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </a>
                </div>
            </div>

            {/* Subtle background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.03] blur-[150px] rounded-full pointer-events-none" suppressHydrationWarning></div>
        </section>
    );
}
