'use client';

import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function PrivacyPolicy() {
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
                                    Data Sovereignty
                                </span>
                            </div>
                            <h1 className="text-5xl sm:text-7xl md:text-8xl font-thin tracking-tighter uppercase leading-[0.9]">
                                Privacy<br />
                                <span className="text-white/20 italic font-light">Protocol</span>
                            </h1>
                            <p className="text-white/40 font-thin text-xs sm:text-sm tracking-[0.2em] uppercase max-w-xl leading-relaxed">
                                This legal architecture governs how <span className="text-white">7863983914</span> processes your information through our platform: <span className="text-white">makers3d.in</span>.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Content Matrix */}
                <section className="pb-32 px-6 sm:px-8">
                    <div className="max-w-4xl mx-auto flex flex-col gap-24">

                        {/* 00. Introduction */}
                        <div className="relative group animate-fadeInUp" style={{ animationDelay: '200ms' }}>
                            <div className="absolute -inset-8 bg-white/[0.01] border border-white/5 rounded-[40px] -z-10 transition-all duration-700 group-hover:bg-white/[0.02] group-hover:border-white/10" />
                            <div className="space-y-6">
                                <div className="flex items-baseline gap-4">
                                    <span className="text-white/10 font-mono text-4xl">00</span>
                                    <h2 className="text-2xl sm:text-3xl font-thin tracking-[0.3em] uppercase">Introduction</h2>
                                </div>
                                <p className="text-white/70 font-thin text-sm sm:text-base leading-relaxed tracking-wide">
                                    This Privacy Policy describes how <span className="text-white">7863983914</span> and its affiliates (collectively "7863983914, we, our, us") collect, use, share, protect or otherwise process your information/personal data through our website <span className="text-white italic">https://makers3d.in/</span> (hereinafter referred to as Platform).
                                    <br /><br />
                                    We do not offer any product/service under this Platform outside India and your personal data will primarily be stored and processed in India. By visiting this Platform, you expressly agree to be bound by the terms of this policy and the laws of India.
                                </p>
                            </div>
                        </div>

                        {/* 01. Collection */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 animate-fadeInUp" style={{ animationDelay: '400ms' }}>
                            <div className="md:col-span-4">
                                <div className="sticky top-32 flex flex-col gap-2">
                                    <span className="text-white/20 font-mono text-sm tracking-widest">01 / CAPTURE</span>
                                    <h3 className="text-white font-thin tracking-[0.2em] uppercase border-l-2 border-white/10 pl-4 py-1">Collection</h3>
                                </div>
                            </div>
                            <div className="md:col-span-8 space-y-6">
                                <p className="text-white/60 font-thin text-sm sm:text-base leading-relaxed tracking-wide">
                                    Data points captured during your interaction session include:
                                </p>
                                <ul className="space-y-4">
                                    {[
                                        "Sign-up metrics: Name, date of birth, address, email, and mobile number.",
                                        "Sensitive Intelligence: Bank account details, credit/debit card information, or biometric facets (facial features/physiological info) where opted.",
                                        "Behavioral Mapping: Tracking preferences and transaction history on our platform or third-party partner architectures."
                                    ].map((item, i) => (
                                        <li key={i} className="flex gap-4 group">
                                            <div className="w-1.5 h-1.5 rounded-full bg-white/20 mt-2 flex-shrink-0 group-hover:bg-white transition-colors" />
                                            <span className="text-white/40 font-thin text-sm tracking-wide group-hover:text-white/70 transition-colors">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* 02. Usage */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 animate-fadeInUp" style={{ animationDelay: '600ms' }}>
                            <div className="md:col-span-4">
                                <div className="sticky top-32 flex flex-col gap-2">
                                    <span className="text-white/20 font-mono text-sm tracking-widest">02 / LOGIC</span>
                                    <h3 className="text-white font-thin tracking-[0.2em] uppercase border-l-2 border-white/10 pl-4 py-1">Data Usage</h3>
                                </div>
                            </div>
                            <div className="md:col-span-8">
                                <p className="text-white/60 font-thin text-sm sm:text-base leading-relaxed tracking-wide">
                                    We leverage your personal data to fulfill order requisitions; resolve technical disputes; troubleshoot logistical bottlenecks; and communicate online/offline offers. We maintain the integrity of our ecosystem by detecting and neutralizing fraud, criminal activity, or system errors.
                                </p>
                            </div>
                        </div>

                        {/* 03. Sharing */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 animate-fadeInUp" style={{ animationDelay: '800ms' }}>
                            <div className="md:col-span-4">
                                <div className="sticky top-32 flex flex-col gap-2">
                                    <span className="text-white/20 font-mono text-sm tracking-widest">03 / NETWORK</span>
                                    <h3 className="text-white font-thin tracking-[0.2em] uppercase border-l-2 border-white/10 pl-4 py-1">Disclosures</h3>
                                </div>
                            </div>
                            <div className="md:col-span-8 space-y-6">
                                <p className="text-white/60 font-thin text-sm sm:text-base leading-relaxed tracking-wide">
                                    Information may be synchronized internally within our corporate entities or disclosed to third-party nodes including:
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[
                                        "Logistics Nodes (Shipping)",
                                        "Financial Gateways (Payments)",
                                        "Law Enforcement (Subpoenas/Orders)",
                                        "Security Frameworks (Fraud Prevention)"
                                    ].map((item, i) => (
                                        <div key={i} className="p-4 border border-white/5 bg-white/[0.01] rounded-xl text-[10px] font-bold tracking-widest uppercase text-white/40">
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* 04. Security */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 animate-fadeInUp" style={{ animationDelay: '1000ms' }}>
                            <div className="md:col-span-4">
                                <div className="sticky top-32 flex flex-col gap-2">
                                    <span className="text-white/20 font-mono text-sm tracking-widest">04 / DEFENSE</span>
                                    <h3 className="text-white font-thin tracking-[0.2em] uppercase border-l-2 border-white/10 pl-4 py-1">Precautions</h3>
                                </div>
                            </div>
                            <div className="md:col-span-8">
                                <p className="text-white/60 font-thin text-sm sm:text-base leading-relaxed tracking-wide">
                                    While we adopt industrial-grade security procedures and secure server environments, the transmission of data over the World Wide Web carries inherent risks. Users are exclusively responsible for the protection of their authentication records (logins/passwords).
                                </p>
                            </div>
                        </div>

                        {/* 05. Deletion & Retention */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 animate-fadeInUp" style={{ animationDelay: '1200ms' }}>
                            <div className="md:col-span-4">
                                <div className="sticky top-32 flex flex-col gap-2">
                                    <span className="text-white/20 font-mono text-sm tracking-widest">05 / LIFECYCLE</span>
                                    <h3 className="text-white font-thin tracking-[0.2em] uppercase border-l-2 border-white/10 pl-4 py-1">Retention</h3>
                                </div>
                            </div>
                            <div className="md:col-span-8">
                                <p className="text-white/60 font-thin text-sm sm:text-base leading-relaxed tracking-wide">
                                    You possess the option to delete your account via profile settings. We retain information only for the duration required for its specific purpose, or as mandated by legal frameworks. Anonymized data may be kept indefinitely for research and analytical optimization.
                                </p>
                            </div>
                        </div>

                        {/* 06. Consent */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 animate-fadeInUp" style={{ animationDelay: '1400ms' }}>
                            <div className="md:col-span-4">
                                <div className="sticky top-32 flex flex-col gap-2">
                                    <span className="text-white/20 font-mono text-sm tracking-widest">06 / AUTHORITY</span>
                                    <h3 className="text-white font-thin tracking-[0.2em] uppercase border-l-2 border-white/10 pl-4 py-1">User Rights</h3>
                                </div>
                            </div>
                            <div className="md:col-span-8 space-y-6">
                                <p className="text-white/60 font-thin text-sm sm:text-base leading-relaxed tracking-wide">
                                    By interfacing with the platform, you consent to the processing of your information. You may withdraw this consent at any time by contacting our Grievance Officer, noting that this may restrict your access to certain masterpiece acquisitions.
                                </p>
                            </div>
                        </div>

                        {/* Grievance Officer Block */}
                        <div className="pt-32 border-t border-white/10 animate-fadeInUp" style={{ animationDelay: '1600ms' }}>
                            <div className="bg-white/[0.02] border border-white/5 p-10 sm:p-16 rounded-[40px] backdrop-blur-md">
                                <div className="flex flex-col gap-10">
                                    <div className="space-y-4">
                                        <h3 className="text-white font-thin text-3xl sm:text-4xl tracking-widest uppercase">Grievance Officer</h3>
                                        <p className="text-white/30 font-mono text-xs uppercase tracking-[0.2em]">Legal Infrastructure Contact</p>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
                                        <div className="space-y-6">
                                            <div className="space-y-1">
                                                <span className="text-white/20 text-[10px] uppercase tracking-tighter">Designation</span>
                                                <p className="text-white font-thin text-xl tracking-wide">Department Lead</p>
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-white/20 text-[10px] uppercase tracking-tighter">Entity Address</span>
                                                <p className="text-white font-thin text-xl tracking-wide leading-relaxed">7863983914, India</p>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="space-y-1">
                                                <span className="text-white/20 text-[10px] uppercase tracking-tighter">Communication</span>
                                                <p className="text-white font-thin text-xl tracking-wide">support@makers3d.in</p>
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-white/20 text-[10px] uppercase tracking-tighter">Timeline</span>
                                                <p className="text-white font-thin text-lg tracking-wide uppercase">Mon - Fri [09:00 - 18:00]</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-8 flex justify-center">
                                        <div className="px-8 py-3 bg-white/5 rounded-full border border-white/10">
                                            <span className="text-white/40 text-[9px] font-mono tracking-[0.4em] uppercase">Last Protocol Update: January 2026</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Support Footer */}
                        <div className="pt-24 animate-fadeInUp" style={{ animationDelay: '1800ms' }}>
                            <div className="flex flex-col items-center text-center gap-8">
                                <div className="w-px h-24 bg-gradient-to-b from-white/20 to-transparent" />
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
