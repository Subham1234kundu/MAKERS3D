'use client';

import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { gsap } from 'gsap';

export default function PartnerWithUs() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        partnershipType: 'Collaboration',
        message: ''
    });
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');

        try {
            const response = await fetch('/api/partner', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setStatus('success');
                setFormData({ name: '', email: '', company: '', partnershipType: 'Collaboration', message: '' });
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error('Submission error:', error);
            setStatus('error');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const openWhatsApp = () => {
        const phoneNumber = '7863983914';
        const message = encodeURIComponent('Hello MAKERS3D, I am interested in exploring a partnership.');
        window.open(`https://wa.me/91${phoneNumber}?text=${message}`, '_blank');
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
            <Navbar />

            {/* Background Ambience */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-white/5 blur-[120px] rounded-full animate-glow" />
                <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] bg-white/[0.03] blur-[150px] rounded-full animate-glow-delayed" />
            </div>

            <main className="relative z-10">
                {/* Hero Section */}
                <section className="pt-40 pb-20 px-6 sm:px-8">
                    <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16 md:gap-24">
                        <div className="flex-1 space-y-8 animate-fadeInUp">
                            <div className="flex items-center gap-4">
                                <span className="w-12 h-[1px] bg-white/20"></span>
                                <span className="text-white/40 text-[10px] sm:text-xs font-mono tracking-[0.6em] uppercase">
                                    Network Synthesis
                                </span>
                            </div>
                            <h1 className="text-6xl sm:text-8xl font-thin tracking-tighter uppercase leading-[0.9]">
                                Partner<br />
                                <span className="text-white/20 italic font-light">With Us</span>
                            </h1>
                            <p className="text-white/40 font-thin text-sm sm:text-base tracking-[0.2em] uppercase max-w-md leading-relaxed">
                                Expand your creative horizons. Align with MAKERS3D to pioneer industrial-grade 3D craftsmanship.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-6 pt-4">
                                <button
                                    onClick={openWhatsApp}
                                    className="flex items-center justify-center gap-3 px-8 py-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold tracking-[0.3em] uppercase rounded-full hover:bg-emerald-500 hover:text-white transition-all duration-500 group"
                                >
                                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                    </svg>
                                    Sync via WhatsApp
                                </button>
                            </div>
                        </div>

                        {/* Form Section */}
                        <div className="flex-1 w-full max-w-md animate-fadeInUp" style={{ animationDelay: '200ms' }}>
                            <div className="relative group">
                                <div className="absolute -inset-4 bg-white/[0.02] border border-white/10 rounded-[40px] -z-10 blur-xl group-hover:bg-white/[0.04] transition-all duration-700" />
                                <form
                                    onSubmit={handleSubmit}
                                    className="bg-black/40 backdrop-blur-3xl border border-white/10 p-8 sm:p-10 rounded-2xl space-y-6"
                                >
                                    <div className="space-y-1">
                                        <label className="text-[10px] text-white/30 tracking-[0.2em] uppercase font-mono ml-1">Name</label>
                                        <input
                                            required
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Your Name"
                                            className="w-full bg-transparent border-b border-white/20 px-0 py-3 text-sm focus:outline-none focus:border-white transition-all font-light tracking-wide placeholder:text-white/10"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] text-white/30 tracking-[0.2em] uppercase font-mono ml-1">Email</label>
                                            <input
                                                required
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="Email"
                                                className="w-full bg-transparent border-b border-white/20 px-0 py-3 text-sm focus:outline-none focus:border-white transition-all font-light tracking-wide placeholder:text-white/10"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] text-white/30 tracking-[0.2em] uppercase font-mono ml-1">Company</label>
                                            <input
                                                type="text"
                                                name="company"
                                                value={formData.company}
                                                onChange={handleChange}
                                                placeholder="Company"
                                                className="w-full bg-transparent border-b border-white/20 px-0 py-3 text-sm focus:outline-none focus:border-white transition-all font-light tracking-wide placeholder:text-white/10"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[10px] text-white/30 tracking-[0.2em] uppercase font-mono ml-1">Partnership Type</label>
                                        <div className="relative">
                                            <select
                                                name="partnershipType"
                                                value={formData.partnershipType}
                                                onChange={handleChange}
                                                className="w-full bg-transparent border-b border-white/20 px-0 py-3 text-sm focus:outline-none focus:border-white transition-all font-light tracking-wide appearance-none"
                                            >
                                                <option value="Collaboration" className="bg-zinc-900">Collaboration</option>
                                                <option value="Reseller" className="bg-zinc-900">Reseller</option>
                                                <option value="Bulk Order" className="bg-zinc-900">Bulk Order</option>
                                                <option value="Creative Studio" className="bg-zinc-900">Creative Studio</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[10px] text-white/30 tracking-[0.2em] uppercase font-mono ml-1">Message</label>
                                        <textarea
                                            required
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            rows={2}
                                            placeholder="Briefly describe your vision..."
                                            className="w-full bg-transparent border-b border-white/20 px-0 py-3 text-sm focus:outline-none focus:border-white transition-all font-light tracking-wide placeholder:text-white/10 resize-none"
                                        />
                                    </div>

                                    <button
                                        disabled={status === 'submitting'}
                                        className={`w-full py-5 rounded-xl text-[10px] font-bold tracking-[0.4em] uppercase transition-all duration-500 overflow-hidden relative group
                                            ${status === 'success' ? 'bg-emerald-500 text-white' :
                                                status === 'error' ? 'bg-red-500 text-white' :
                                                    'bg-white text-black hover:opacity-90 active:scale-95'}`}
                                    >
                                        <span className="relative z-10">
                                            {status === 'idle' && 'Initialize Sync'}
                                            {status === 'submitting' && 'Processing...'}
                                            {status === 'success' && 'Inquiry Dispatched'}
                                            {status === 'error' && 'Retry Sync'}
                                        </span>
                                        <div className="absolute inset-0 bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Feature Cards */}
                <section className="pb-32 px-6 sm:px-8">
                    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: 'Global Precision', desc: 'Ships our industrial-grade masterpieces to your location with tracked transparency.', icon: '01' },
                            { title: 'Bespoke Scale', desc: 'Custom synthesis for large-scale architectural projects or corporate gifting suites.', icon: '02' },
                            { title: 'Studio Access', desc: 'Direct logic bridge with our design core for exclusive prototype iterations.', icon: '03' }
                        ].map((feat, i) => (
                            <div key={i} className="group p-8 border border-white/5 rounded-3xl hover:border-white/20 transition-all duration-700 hover:bg-white/[0.01]">
                                <span className="text-white/10 font-mono text-[10px] mb-6 block tracking-widest">[{feat.icon}]</span>
                                <h3 className="text-white text-xl font-thin tracking-widest uppercase mb-4 group-hover:text-white transition-colors">{feat.title}</h3>
                                <p className="text-white/30 font-thin text-xs leading-relaxed uppercase tracking-widest">{feat.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            <Footer />
        </div >
    );
}
