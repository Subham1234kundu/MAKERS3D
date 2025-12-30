'use client';

import { useState } from 'react';
import { gsap } from 'gsap';

export default function Newsletter() {
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus('loading');
        try {
            const res = await fetch('/api/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, phone }),
            });

            const data = await res.json();

            if (res.ok) {
                setStatus('success');
                setMessage('Thank you for joining our exclusive circle.');
                setEmail('');
                gsap.fromTo('.success-msg', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5 });
            } else {
                setStatus('error');
                setMessage(data.message || 'Something went wrong.');
            }
        } catch (error) {
            setStatus('error');
            setMessage('Failed to connect. Please try again.');
        }
    };

    return (
        <section className="bg-black py-24 px-8 border-t border-white/5 overflow-hidden relative" suppressHydrationWarning>
            <div className="max-w-4xl mx-auto text-center relative z-10" suppressHydrationWarning>
                <h2 className="text-3xl md:text-5xl font-thin tracking-tighter mb-6 uppercase">
                    Join the <span className="italic font-light">Makers</span> Inner Circle
                </h2>
                <p className="text-white/40 font-thin text-sm md:text-base tracking-wide max-w-xl mx-auto mb-10">
                    Be the first to experience our newest creations, exclusive drops, and behind-the-scenes insights into the future of 3D craftsmanship.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto">
                    <input
                        type="email"
                        placeholder="EMAIL ADDRESS"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="flex-grow bg-white/5 border border-white/10 px-6 py-4 text-xs tracking-[0.2em] font-light text-white focus:outline-none focus:border-white/30 transition-all uppercase"
                    />
                    <input
                        type="tel"
                        placeholder="PHONE NUMBER (OPTIONAL)"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="flex-grow bg-white/5 border border-white/10 px-6 py-4 text-xs tracking-[0.2em] font-light text-white focus:outline-none focus:border-white/30 transition-all uppercase"
                    />
                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="bg-white text-black px-10 py-4 text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-gray-200 transition-all disabled:opacity-50"
                    >
                        {status === 'loading' ? 'JOINING...' : 'SUBSCRIBE'}
                    </button>
                </form>

                {status === 'success' && (
                    <p className="success-msg mt-6 text-green-400 text-[10px] uppercase tracking-widest font-light">
                        {message}
                    </p>
                )}
                {status === 'error' && (
                    <p className="mt-6 text-red-500 text-[10px] uppercase tracking-widest font-light">
                        {message}
                    </p>
                )}
            </div>

            {/* Subtle background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-white/5 blur-[120px] rounded-full pointer-events-none opacity-30" suppressHydrationWarning></div>
        </section>
    );
}
