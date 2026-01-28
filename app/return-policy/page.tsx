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

                        {/* 00. Policy Core - Final Acquisition */}
                        <div className="relative group animate-fadeInUp" style={{ animationDelay: '200ms' }}>
                            <div className="absolute -inset-8 bg-white/[0.01] border border-white/5 rounded-[40px] -z-10 transition-all duration-700 group-hover:bg-white/[0.02] group-hover:border-white/10" />
                            <div className="space-y-8">
                                <div className="flex items-baseline gap-4">
                                    <span className="text-white/10 font-mono text-4xl">00</span>
                                    <h2 className="text-2xl sm:text-3xl font-thin tracking-[0.3em] uppercase">Policy Protocol</h2>
                                </div>
                                <div className="bg-white/5 border border-white/10 p-8 sm:p-10 rounded-2xl backdrop-blur-sm">
                                    <p className="text-white/70 font-thin text-sm sm:text-lg leading-relaxed tracking-wide">
                                        At <span className="text-white font-medium uppercase tracking-widest">MAKERS3D</span>, our creations are industrial-grade and custom-manufactured.
                                        <br /><br />
                                        <span className="inline-block border border-white/20 px-4 py-2 rounded-full text-white text-xs font-bold tracking-[0.2em] uppercase mb-4">Final Acquisition Notice</span>
                                        <br />
                                        We uphold a strict <span className="text-white font-bold underline decoration-white/40 underline-offset-8">No-Return and No-Refund Policy</span>. We do not accept returns or provide refunds. Once an order is confirmed, the transaction is definitive.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* 01. Exchange Protocol */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 animate-fadeInUp" style={{ animationDelay: '400ms' }}>
                            <div className="md:col-span-4">
                                <div className="sticky top-32 flex flex-col gap-2">
                                    <span className="text-white/20 font-mono text-sm tracking-widest">01 / EXCHANGE</span>
                                    <h3 className="text-white font-thin tracking-[0.2em] uppercase border-l-2 border-white/10 pl-4 py-1">Exchange Only</h3>
                                </div>
                            </div>
                            <div className="md:col-span-8">
                                <p className="text-white/60 font-thin text-sm sm:text-base leading-relaxed tracking-wide">
                                    While we do not accept returns, we facilitate an <span className="text-white font-medium">Exchange Protocol</span> exclusively for products that meet our quality standards but require a shift in specification or have faced transit discrepancies.
                                </p>
                            </div>
                        </div>

                        {/* 02. Request Window */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 animate-fadeInUp" style={{ animationDelay: '600ms' }}>
                            <div className="md:col-span-4">
                                <div className="sticky top-32 flex flex-col gap-2">
                                    <span className="text-white/20 font-mono text-sm tracking-widest">02 / WINDOW</span>
                                    <h3 className="text-white font-thin tracking-[0.2em] uppercase border-l-2 border-white/10 pl-4 py-1">24-Hour Window</h3>
                                </div>
                            </div>
                            <div className="md:col-span-8 space-y-8">
                                <p className="text-white/60 font-thin text-sm sm:text-base leading-relaxed tracking-wide">
                                    To maintain our production rhythm, any request for exchange or replacement must be raised within <span className="text-white font-bold">24 hours</span> from the moment of delivery. Beyond this period, the acquisition is considered absolute.
                                </p>
                            </div>
                        </div>

                        {/* 03. Resolution Timeline */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 animate-fadeInUp" style={{ animationDelay: '800ms' }}>
                            <div className="md:col-span-4">
                                <div className="sticky top-32 flex flex-col gap-2">
                                    <span className="text-white/20 font-mono text-sm tracking-widest">03 / TIMELINE</span>
                                    <h3 className="text-white font-thin tracking-[0.2em] uppercase border-l-2 border-white/10 pl-4 py-1">Fulfillment</h3>
                                </div>
                            </div>
                            <div className="md:col-span-8">
                                <p className="text-white/60 font-thin text-sm sm:text-base leading-relaxed tracking-wide">
                                    Once an exchange is approved, we prioritize your new unit in our production queue. We will deliver the replaced or exchanged products within <span className="text-white font-bold">4-5 days</span>.
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
                                    <p className="text-white/20 text-[10px] uppercase tracking-[0.2em] mt-2">Proprietor: Subham Kundu</p>
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
