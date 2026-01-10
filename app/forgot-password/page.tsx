'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { gsap } from 'gsap';

const ParticleCubeLogo = dynamic(() => import('../components/ParticleCubeLogo'), {
    ssr: false,
    loading: () => <div style={{ width: '60px', height: '60px' }} />
});

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const containerRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(formRef.current,
                { opacity: 0, y: 20, filter: 'blur(10px)' },
                { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.2, ease: 'power3.out', delay: 0.2 }
            );
        }, containerRef);

        return () => ctx.revert();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({ type: 'success', text: 'RESET LINK SENT TO YOUR EMAIL' });
            } else {
                setMessage({ type: 'error', text: data.message.toUpperCase() || 'FAILED TO SEND LINK' });
                gsap.to(formRef.current, { x: 10, duration: 0.1, yoyo: true, repeat: 5, ease: 'power2.inOut' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'INTERNAL SERVER ERROR' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div ref={containerRef} className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden font-['Helvetica_Neue',Arial,sans-serif]">
            {/* Background Grid Pattern */}
            <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                    backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.015) 1px, transparent 1px)`,
                    backgroundSize: '60px 60px'
                }}
            ></div>

            {/* Back to Login Button */}
            <Link
                href="/login"
                className="absolute top-8 left-8 z-50 flex items-center gap-2 text-[10px] tracking-[0.3em] text-white/40 hover:text-white transition-all group"
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="transition-transform group-hover:-translate-x-1">
                    <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                BACK TO LOGIN
            </Link>

            <div ref={formRef} className="relative z-10 w-full max-w-[400px] px-6 py-12">
                {/* Minimal Cube Logo */}
                <div className="flex justify-center mb-10 opacity-80">
                    <div className="scale-75">
                        <ParticleCubeLogo />
                    </div>
                </div>

                {/* Title Group */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-thin tracking-[0.2em] text-white uppercase mb-3">
                        RECOVER
                    </h1>
                    <p className="text-[10px] tracking-[0.3em] text-white/30 uppercase">
                        Enter email to reset password
                    </p>
                </div>

                {/* Message Display */}
                {message && (
                    <div className={`text-[10px] tracking-widest text-center uppercase mb-8 animate-pulse ${message.type === 'success' ? 'text-green-500/80' : 'text-red-500/80'}`}>
                        {message.text}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-10">
                    <div className="relative group">
                        <label className="text-[9px] tracking-[0.3em] text-white/40 uppercase mb-2 block transition-colors group-focus-within:text-white/70">
                            EMAIL ADDRESS
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-transparent border-b border-white/10 py-3 text-sm text-white font-light tracking-wide outline-none transition-all focus:border-white/40 placeholder:text-white/5"
                            placeholder="USER@EXAMPLE.COM"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full relative py-4 text-[11px] tracking-[0.3em] text-black bg-white uppercase font-normal rounded-sm transition-all hover:bg-gray-200 active:scale-[0.98] disabled:opacity-50"
                    >
                        {isLoading ? 'PROCESSING...' : 'SEND RESET LINK'}
                    </button>


                </form>
            </div>

            {/* Background Decorative Glows */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>
        </div>
    );
}
