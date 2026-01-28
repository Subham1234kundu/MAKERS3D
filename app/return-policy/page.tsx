'use client';

import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function ReturnPolicy() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
            <Navbar />

            {/* Dynamic Background Element */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/5 blur-[120px] rounded-full animate-glow" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-white/[0.03] blur-[120px] rounded-full animate-glow-delayed" />
            </div>

            <main className="relative z-10">
                {/* Page Header */}
                <section className="pt-32 pb-20 px-6 sm:px-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex flex-col gap-6 animate-fadeInUp">
                            <div className="flex items-center gap-4">
                                <span className="w-12 h-[1px] bg-white/20"></span>
                                <span className="text-white/40 text-[10px] sm:text-xs font-mono tracking-[0.6em] uppercase">
                                    Service Excellence
                                </span>
                            </div>
                            <h1 className="text-5xl sm:text-7xl md:text-8xl font-thin tracking-tighter uppercase leading-[0.9]">
                                Returns &<br />
                                <span className="text-white/20 italic font-light">Refinement</span>
                            </h1>
                            <p className="text-white/40 font-thin text-xs sm:text-sm tracking-[0.2em] uppercase max-w-md">
                                Our protocol for acquisitions, exchanges, and the preservation of quality.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Content Matrix */}
                <section className="pb-32 px-6 sm:px-8">
                    <div className="max-w-4xl mx-auto flex flex-col gap-24">

                        {/* 00. Refund Protocol - The Critical Statement */}
                        <div className="relative group animate-fadeInUp" style={{ animationDelay: '200ms' }}>
                            <div className="absolute -inset-8 bg-white/[0.01] border border-white/5 rounded-[40px] -z-10 transition-all duration-700 group-hover:bg-white/[0.02] group-hover:border-white/10" />
                            <div className="space-y-8">
                                <div className="flex items-baseline gap-4">
                                    <span className="text-white/10 font-mono text-4xl">00</span>
                                    <h2 className="text-2xl sm:text-3xl font-thin tracking-[0.3em] uppercase">Refund Protocol</h2>
                                </div>
                                <div className="bg-white/5 border border-white/10 p-8 sm:p-10 rounded-2xl backdrop-blur-sm">
                                    <p className="text-white/70 font-thin text-sm sm:text-lg leading-relaxed tracking-wide">
                                        At <span className="text-white font-medium uppercase tracking-widest">MAKERS3D</span>, we deliver industrial-grade precision and bespoke craftsmanship.
                                        <br /><br />
                                        <span className="inline-block border border-white/20 px-4 py-2 rounded-full text-white text-xs font-bold tracking-[0.2em] uppercase mb-4">Crucial Notice</span>
                                        <br />
                                        We <span className="text-white font-bold underline decoration-white/40 underline-offset-8">do not issue refunds</span> for any purchases. All acquisitions are final. We advise our clients to ensure their technical and aesthetic specifications are met before committing to a purchase.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* 01. Exchange window */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 animate-fadeInUp" style={{ animationDelay: '400ms' }}>
                            <div className="md:col-span-4">
                                <div className="sticky top-32 flex flex-col gap-2">
                                    <span className="text-white/20 font-mono text-sm tracking-widest">01 / WINDOW</span>
                                    <h3 className="text-white font-thin tracking-[0.2em] uppercase border-l-2 border-white/10 pl-4 py-1">Exchange Period</h3>
                                </div>
                            </div>
                            <div className="md:col-span-8">
                                <p className="text-white/60 font-thin text-sm sm:text-base leading-relaxed tracking-wide">
                                    While refunds are restricted, we facilitate an <span className="text-white">Exchange Protocol</span> valid within <span className="text-white font-normal underline underline-offset-4 decoration-white/20">4-5 days</span> of the acquisition date. Beyond this micro-period, no return, exchange, or modification will be entertained.
                                </p>
                            </div>
                        </div>

                        {/* 02. Eligibility criteria */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 animate-fadeInUp" style={{ animationDelay: '600ms' }}>
                            <div className="md:col-span-4">
                                <div className="sticky top-32 flex flex-col gap-2">
                                    <span className="text-white/20 font-mono text-sm tracking-widest">02 / STATUS</span>
                                    <h3 className="text-white font-thin tracking-[0.2em] uppercase border-l-2 border-white/10 pl-4 py-1">Eligibility</h3>
                                </div>
                            </div>
                            <div className="md:col-span-8 space-y-8">
                                <p className="text-white/60 font-thin text-sm sm:text-base leading-relaxed tracking-wide">
                                    To qualify for an exchange, the item must maintain its original structural integrity:
                                </p>
                                <div className="space-y-4">
                                    {[
                                        "Item must be entirely unused and in pristine condition.",
                                        "Must retain original internal and external packaging.",
                                        "Items acquired during promotional or 'Sale' events are generally ineligible."
                                    ].map((item, i) => (
                                        <div key={i} className="flex gap-6 group">
                                            <span className="text-white/10 font-mono text-xs pt-1">[{i + 1}]</span>
                                            <p className="text-white/40 font-thin text-sm tracking-wide group-hover:text-white/70 transition-colors">
                                                {item}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* 03. Damage & Defect */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 animate-fadeInUp" style={{ animationDelay: '800ms' }}>
                            <div className="md:col-span-4">
                                <div className="sticky top-32 flex flex-col gap-2">
                                    <span className="text-white/20 font-mono text-sm tracking-widest">03 / PRECISION</span>
                                    <h3 className="text-white font-thin tracking-[0.2em] uppercase border-l-2 border-white/10 pl-4 py-1">Defects</h3>
                                </div>
                            </div>
                            <div className="md:col-span-8">
                                <p className="text-white/60 font-thin text-sm sm:text-base leading-relaxed tracking-wide">
                                    Replacements are strictly reserved for instances of <span className="text-white italic">material defect</span> or <span className="text-white italic">transit damage</span>. Any such discrepancies must be reported immediately via our exchange portal.
                                </p>
                            </div>
                        </div>

                        {/* 04. Procedure */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 animate-fadeInUp" style={{ animationDelay: '1000ms' }}>
                            <div className="md:col-span-4">
                                <div className="sticky top-32 flex flex-col gap-2">
                                    <span className="text-white/20 font-mono text-sm tracking-widest">04 / FLOW</span>
                                    <h3 className="text-white font-thin tracking-[0.2em] uppercase border-l-2 border-white/10 pl-4 py-1">The Process</h3>
                                </div>
                            </div>
                            <div className="md:col-span-8">
                                <p className="text-white/60 font-thin text-sm sm:text-base leading-relaxed tracking-wide">
                                    Upon receipt and rigorous quality assessment of your returned item, an electronic notification will be dispatched. If approved, the exchange will be synchronized with our production queue and inventory availability.
                                </p>
                            </div>
                        </div>

                        {/* Support Footer */}
                        <div className="pt-24 border-t border-white/10 animate-fadeInUp" style={{ animationDelay: '1200ms' }}>
                            <div className="flex flex-col items-center text-center gap-8">
                                <div className="w-px h-24 bg-gradient-to-b from-white/20 to-transparent" />
                                <div className="space-y-4">
                                    <h3 className="text-white/40 font-thin text-[10px] sm:text-xs tracking-[0.4em] uppercase">
                                        Protocol Assistance
                                    </h3>
                                    <a
                                        href="mailto:support@makers3d.in"
                                        className="text-white text-xl sm:text-3xl font-thin tracking-widest hover:text-white/60 transition-colors"
                                    >
                                        support@makers3d.in
                                    </a>
                                </div>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => window.history.back()}
                                        className="px-10 py-4 bg-white/5 border border-white/10 text-white text-[10px] font-bold tracking-[0.4em] uppercase rounded-full hover:bg-white hover:text-black transition-all duration-500"
                                    >
                                        Return to Gallery
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
