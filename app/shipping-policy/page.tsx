'use client';

import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function ShippingPolicy() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
            <Navbar />

            {/* Dynamic Background Element - Cinematic Layer */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-5%] right-[-5%] w-[50%] h-[50%] bg-white/5 blur-[150px] rounded-full animate-glow" />
                <div className="absolute top-[20%] left-[-10%] w-[35%] h-[35%] bg-white/[0.02] blur-[150px] rounded-full animate-glow-delayed" />
            </div>

            <main className="relative z-10">
                {/* Page Header */}
                <section className="pt-32 pb-20 px-6 sm:px-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex flex-col gap-6 animate-fadeInUp">
                            <div className="flex items-center gap-4">
                                <span className="w-12 h-[1px] bg-white/20"></span>
                                <span className="text-white/40 text-[10px] sm:text-xs font-mono tracking-[0.6em] uppercase">
                                    Logistics Framework
                                </span>
                            </div>
                            <h1 className="text-5xl sm:text-7xl md:text-8xl font-thin tracking-tighter uppercase leading-[0.9]">
                                Shipping<br />
                                <span className="text-white/20 italic font-light">Policy</span>
                            </h1>
                            <p className="text-white/40 font-thin text-xs sm:text-sm tracking-[0.2em] uppercase max-w-xl leading-relaxed">
                                Our commitment to delivering your masterpieces safely and efficiently across the nation.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Content Matrix */}
                <section className="pb-32 px-6 sm:px-8">
                    <div className="max-w-4xl mx-auto flex flex-col gap-24">

                        {/* 01. Delivery Framework */}
                        <div className="relative group animate-fadeInUp" style={{ animationDelay: '200ms' }}>
                            <div className="absolute -inset-8 bg-white/[0.01] border border-white/5 rounded-[40px] -z-10 transition-all duration-700 group-hover:bg-white/[0.02] group-hover:border-white/10" />
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                                <div className="md:col-span-4">
                                    <div className="sticky top-32 flex flex-col gap-2">
                                        <span className="text-white/20 font-mono text-sm tracking-widest">01 / DISPATCH</span>
                                        <h3 className="text-white font-thin tracking-[0.2em] uppercase border-l-2 border-white/10 pl-4 py-1">Timeline</h3>
                                    </div>
                                </div>
                                <div className="md:col-span-8 space-y-6">
                                    <p className="text-white/70 font-thin text-sm sm:text-base leading-relaxed tracking-wide">
                                        The orders for the user are shipped through registered domestic courier companies and/or speed post only.
                                        Products are <span className="text-white font-medium">shipped and delivered within 10 days</span> from the date of the order and/or payment confirmation, subject to courier company / post office norms.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* 02. Liability & Constraints */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 animate-fadeInUp" style={{ animationDelay: '400ms' }}>
                            <div className="md:col-span-4">
                                <div className="sticky top-32 flex flex-col gap-2">
                                    <span className="text-white/20 font-mono text-sm tracking-widest">02 / LIABILITY</span>
                                    <h3 className="text-white font-thin tracking-[0.2em] uppercase border-l-2 border-white/10 pl-4 py-1">Protocol</h3>
                                </div>
                            </div>
                            <div className="md:col-span-8 space-y-6">
                                <p className="text-white/60 font-thin text-sm sm:text-base leading-relaxed tracking-wide">
                                    Platform Owner shall not be liable for any delay in delivery by the courier company / postal authority.
                                    Delivery of all orders will be made to the address provided by the buyer at the time of purchase.
                                </p>
                            </div>
                        </div>

                        {/* 03. Confirmation & Verification */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 animate-fadeInUp" style={{ animationDelay: '600ms' }}>
                            <div className="md:col-span-4">
                                <div className="sticky top-32 flex flex-col gap-2">
                                    <span className="text-white/20 font-mono text-sm tracking-widest">03 / VERIFY</span>
                                    <h3 className="text-white font-thin tracking-[0.2em] uppercase border-l-2 border-white/10 pl-4 py-1">Confirmation</h3>
                                </div>
                            </div>
                            <div className="md:col-span-8">
                                <p className="text-white/60 font-thin text-sm sm:text-base leading-relaxed tracking-wide">
                                    Delivery of our services will be confirmed on your email ID as specified at the time of registration.
                                </p>
                            </div>
                        </div>

                        {/* 04. Financial Terms */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 animate-fadeInUp" style={{ animationDelay: '800ms' }}>
                            <div className="md:col-span-4">
                                <div className="sticky top-32 flex flex-col gap-2">
                                    <span className="text-white/20 font-mono text-sm tracking-widest">04 / FISCAL</span>
                                    <h3 className="text-white font-thin tracking-[0.2em] uppercase border-l-2 border-white/10 pl-4 py-1">Costs</h3>
                                </div>
                            </div>
                            <div className="md:col-span-8">
                                <p className="text-white/60 font-thin text-sm sm:text-base leading-relaxed tracking-wide">
                                    If there are any shipping cost(s) levied by the seller or the Platform Owner (as the case be), the same is not refundable.
                                </p>
                            </div>
                        </div>

                        {/* 05. Order Progression */}
                        <div id="tracking" className="grid grid-cols-1 md:grid-cols-12 gap-12 animate-fadeInUp" style={{ animationDelay: '1000ms' }}>
                            <div className="md:col-span-4">
                                <div className="sticky top-32 flex flex-col gap-2">
                                    <span className="text-white/20 font-mono text-sm tracking-widest">05 / JOURNEY</span>
                                    <h3 className="text-white font-thin tracking-[0.2em] uppercase border-l-2 border-white/10 pl-4 py-1">Order Status</h3>
                                </div>
                            </div>
                            <div className="md:col-span-8 space-y-8">
                                <p className="text-white/60 font-thin text-sm sm:text-base leading-relaxed tracking-wide">
                                    Our production pipeline is transparent and meticulous. You can track your masterpiece through these distinct phases:
                                </p>
                                <div className="space-y-6">
                                    {[
                                        { title: "Order Confirmed", desc: "Payment successfully received and verified." },
                                        // { title: "Design Approved", desc: "For personalized orders, specifications are locked and verified." },
                                        { title: "Printing Started", desc: "The additive manufacturing process has commenced." },
                                        { title: "Quality Check", desc: "Rigorous assessment for structural and aesthetic excellence." },
                                        { title: "Packed & Ready", desc: "Securely encased for transit and awaiting courier dispatch." },
                                        { title: "Shipped", desc: "Handover to logistics partner with active tracking credentials." },
                                        { title: "Delivered", desc: "Final handover to client. Acquisition complete." }
                                    ].filter(step => step.title !== "Design Approved").map((step, i, arr) => (
                                        <div key={i} className="flex gap-6 group">
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-white/40 group-hover:bg-white transition-colors" />
                                                {i !== arr.length - 1 && <div className="w-px h-full bg-white/10" />}
                                            </div>
                                            <div className="space-y-1 pb-4">
                                                <h4 className="text-white font-thin text-sm tracking-[0.2em] uppercase">{step.title}</h4>
                                                <p className="text-white/40 font-thin text-xs tracking-wide group-hover:text-white/70 transition-colors">
                                                    {step.desc}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Support Footer */}
                        <div className="pt-24 animate-fadeInUp" style={{ animationDelay: '1200ms' }}>
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
        </div >
    );
}
