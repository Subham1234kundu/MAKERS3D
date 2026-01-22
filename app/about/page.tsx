'use client';

import React, { useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const BillboardCarousel = () => {
    return (
        <div className="relative w-full h-full flex items-center justify-center p-0 bg-black overflow-hidden">
            {/* Billboard Frame */}
            <img
                src="/images/billboard_frame_black.png"
                alt="Billboard Frame"
                className="absolute inset-0 w-full h-full object-contain z-10 pointer-events-none scale-105"
            />
        </div>
    );
};

export default function AboutPage() {
    const heroRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Initial entrance animations
        const ctx = gsap.context(() => {
            gsap.from('.hero-meta', {
                y: 20,
                opacity: 0,
                duration: 1,
                ease: 'power3.out',
                stagger: 0.2
            });

            gsap.from('.hero-title span', {
                y: 100,
                opacity: 0,
                duration: 1.2,
                ease: 'power4.out',
                stagger: 0.1,
                delay: 0.2
            });

            // Scroll animations for sections
            gsap.utils.toArray('.reveal-section').forEach((section: any) => {
                gsap.from(section, {
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 80%',
                    },
                    y: 50,
                    opacity: 0,
                    duration: 1,
                    ease: 'power2.out'
                });
            });
        }, [heroRef, contentRef]);

        return () => ctx.revert();
    }, []);

    return (
        <main className="bg-black min-h-screen text-white selection:bg-white selection:text-black">
            <Navbar />

            {/* Hero Section */}
            <section ref={heroRef} className="relative h-[90vh] lg:h-[110vh] flex flex-col justify-center items-center overflow-hidden px-6 pt-24 lg:pt-32 pb-40 lg:pb-24">
                <div className="absolute inset-0 z-0 opacity-40">
                    <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black z-10" />
                    {/* Placeholder for cinematic image - recommending a high-end 3D render */}
                    <div
                        className="w-full h-full bg-cover bg-center transition-transform duration-[10s] ease-linear scale-110 animate-slow-zoom"
                        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070&auto=format&fit=crop')` }}
                    />
                </div>

                <div className="relative z-10 text-center max-w-4xl">
                    <div className="hero-meta flex items-center justify-center gap-4 mb-8">
                        <span className="text-[10px] tracking-[0.5em] uppercase text-white/40 font-thin italic">Established MMXXIV</span>
                        <div className="w-12 h-[1px] bg-white/20" />
                        <span className="text-[10px] tracking-[0.5em] uppercase text-white/40 font-thin">Makers 3D Studio</span>
                    </div>

                    <h1 className="hero-title text-5xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.8] mb-12 uppercase flex flex-col items-center">
                        <span className="block">DREAM IN</span>
                        <span className="block text-transparent stroke-text">GEOMETRY</span>
                    </h1>

                    <p className="hero-meta text-xs md:text-sm tracking-[0.3em] uppercase text-white/60 font-light max-w-2xl mx-auto leading-loose pb-20">
                        We don't just print objects; we materialize the impossible.
                        A collective of visionaries bridging the gap between digital etherealism and physical reality.
                    </p>
                </div>

                {/* Perfected Scroll Cue */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-3 opacity-30 animate-pulse">
                    <div className="w-[1px] h-14 bg-gradient-to-b from-white via-white/50 to-transparent" />
                    <span className="text-[7px] text-white tracking-[0.6em] uppercase font-bold">Scroll</span>
                </div>

            </section>

            {/* Vision Section */}
            <section className="pt-24 md:pt-48 pb-0 px-6 sm:px-12 bg-black border-t border-white/[0.05]">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                    <div className="reveal-section">
                        <h2 className="text-3xl md:text-5xl font-thin tracking-tighter uppercase mb-12 leading-tight">
                            The core of <br />
                            <span className="font-black italic">Experimental</span> <br />
                            Design
                        </h2>
                        <div className="space-y-8 text-white/50 text-sm tracking-wide leading-relaxed font-light">
                            <p>
                                Born from the intersection of mathematics and art, Makers 3D started as a clandestine laboratory for 3D experimentation. Our mission was simple: to redefine the boundary of what can be held.
                            </p>
                            <p>
                                Today, we operate at the edge of architectural possibilities, using advanced multi-material deposition and parametric modeling to create pieces that feel like they've been pulled from a higher dimension.
                            </p>
                        </div>
                    </div>

                    <div className="reveal-section relative aspect-square overflow-hidden group">
                        <BillboardCarousel />
                    </div>
                </div>
            </section>

            {/* Ticker / Statement */}
            <div className="bg-white text-black py-4 flex overflow-hidden whitespace-nowrap select-none">
                <div className="flex animate-[marquee_20s_linear_infinite] gap-12 items-center pr-12">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <span key={i} className="text-[10px] tracking-[1em] uppercase font-black">Crafted in the Void — Precision Beyond Limits — Ethereal Aesthetics — Makers 3D Elite</span>
                    ))}
                </div>
            </div>

            {/* Values Section */}
            <section className="pt-12 pb-24 md:pb-48 px-6 sm:px-12">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col gap-2 mb-12 reveal-section">
                        <h3 className="text-xl sm:text-4xl font-thin tracking-tighter text-white uppercase">
                            Operational Pillars
                        </h3>
                        <div className="w-16 h-[1px] bg-white/20"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8">
                        {[
                            { title: 'ATOM-PERFECT', desc: 'Every build is analyzed at the micron level to ensure structural integrity and visual purity.' },
                            { title: 'NEO-MATERIAL', desc: 'We source and develop composite filaments that mimic the textures of fossilized light and liquid metal.' },
                            { title: 'HYPER-STYLE', desc: 'Aesthetic isn\'t an afterthought; it is the fundamental code that drives every design choice.' }
                        ].map((item, i) => (
                            <div key={i} className="reveal-section flex flex-col gap-6 group">
                                <span className="text-white text-xs font-mono">0{i + 1}.</span>
                                <h4 className="text-xl font-black tracking-widest uppercase group-hover:text-white/60 transition-colors">{item.title}</h4>
                                <p className="text-white/30 text-xs tracking-widest uppercase leading-loose font-light">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact CTA */}
            <section className="pb-24 md:pb-48 px-6 text-center border-t border-white/[0.05]">
                <div className="reveal-section max-w-4xl mx-auto">
                    {/* Relevant Picture for Join the Vision */}
                    <div className="mb-16 relative aspect-[21/9] w-full overflow-hidden rounded-2xl border border-white/10 grayscale hover:grayscale-0 transition-all duration-1000 group">
                        <img
                            src="/images/about_brand.png"
                            alt="Makers 3D Vision"
                            className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-1000"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                    </div>

                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-8">Join the Vision</h2>
                    <p className="text-white/40 text-sm tracking-[0.2em] uppercase font-light mb-12 leading-relaxed max-w-2xl mx-auto">
                        Whether you're looking to own a masterpiece or collaborate on the next wave of design innovation, our studio doors are open.
                    </p>
                    <a
                        href="/partner"
                        className="inline-block px-12 py-5 bg-white text-black text-[10px] font-bold tracking-[0.5em] uppercase hover:bg-white/90 hover:scale-105 transition-all duration-500 rounded-full"
                    >
                        Inquire Now
                    </a>
                </div>
            </section>

            <Footer />

            <style jsx>{`
                .stroke-text {
                    -webkit-text-stroke: 1px rgba(255, 255, 255, 0.3);
                }
                @keyframes slow-zoom {
                    from { transform: scale(1.1); }
                    to { transform: scale(1.2); }
                }
                .animate-slow-zoom {
                    animation: slow-zoom 20s infinite alternate linear;
                }
            `}</style>
        </main>
    );
}
