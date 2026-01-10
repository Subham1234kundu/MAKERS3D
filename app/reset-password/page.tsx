'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import { gsap } from 'gsap';

const ParticleCubeLogo = dynamic(() => import('../components/ParticleCubeLogo'), {
    ssr: false,
    loading: () => <div style={{ width: '60px', height: '60px' }} />
});

function ResetPasswordForm() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isVerifying, setIsVerifying] = useState(true);
    const [isValid, setIsValid] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const containerRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Verify token on load
        const verifyToken = async () => {
            if (!token) {
                setIsVerifying(false);
                setIsValid(false);
                return;
            }

            try {
                const response = await fetch(`/api/auth/reset-password?token=${token}`);
                const data = await response.json();
                setIsValid(data.valid);
            } catch (err) {
                setIsValid(false);
            } finally {
                setIsVerifying(false);
            }
        };

        verifyToken();

        const ctx = gsap.context(() => {
            gsap.fromTo(formRef.current,
                { opacity: 0, y: 20, filter: 'blur(10px)' },
                { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.2, ease: 'power3.out', delay: 0.2 }
            );
        }, containerRef);

        return () => ctx.revert();
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage({ type: 'error', text: 'PASSWORDS DO NOT MATCH' });
            return;
        }

        if (password.length < 8) {
            setMessage({ type: 'error', text: 'MINIMUM 8 CHARACTERS REQUIRED' });
            return;
        }

        setIsLoading(true);
        setMessage(null);

        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({ type: 'success', text: 'PASSWORD UPDATED SUCCESSFULLY' });
                setTimeout(() => router.push('/login'), 2000);
            } else {
                setMessage({ type: 'error', text: data.message.toUpperCase() || 'FAILED TO UPDATE PASSWORD' });
                gsap.to(formRef.current, { x: 10, duration: 0.1, yoyo: true, repeat: 5, ease: 'power2.inOut' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'INTERNAL SERVER ERROR' });
        } finally {
            setIsLoading(false);
        }
    };

    if (isVerifying) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-white/10 border-t-white rounded-full animate-spin" />
            </div>
        );
    }

    if (!isValid) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center font-['Helvetica_Neue',Arial,sans-serif]">
                <div className="text-center p-8 border border-white/10 rounded-sm bg-white/5 backdrop-blur-xl max-w-[400px]">
                    <h2 className="text-2xl font-thin tracking-[0.3em] text-white uppercase mb-4">INVALID LINK</h2>
                    <p className="text-[10px] tracking-[0.2em] text-white/40 uppercase mb-8">This password reset link is invalid or has expired.</p>
                    <Link href="/forgot-password" className="inline-block border border-white/20 px-8 py-4 text-[10px] uppercase font-bold tracking-[0.3em] hover:bg-white hover:text-black transition-all">
                        REQUEST NEW LINK
                    </Link>
                </div>
            </div>
        );
    }

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
                        NEW PASSWORD
                    </h1>
                    <p className="text-[10px] tracking-[0.3em] text-white/30 uppercase">
                        Secure your architectural workspace
                    </p>
                </div>

                {/* Message Display */}
                {message && (
                    <div className={`text-[10px] tracking-widest text-center uppercase mb-8 animate-pulse ${message.type === 'success' ? 'text-green-500/80' : 'text-red-500/80'}`}>
                        {message.text}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-6">
                        <div className="relative group">
                            <label className="text-[9px] tracking-[0.3em] text-white/40 uppercase mb-2 block transition-colors group-focus-within:text-white/70">
                                NEW PASSWORD
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-transparent border-b border-white/10 py-3 text-sm text-white font-light tracking-wide outline-none transition-all focus:border-white/40 placeholder:text-white/5 pr-10"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                                            <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                                            <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                                            <line x1="2" x2="22" y1="2" y2="22" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="relative group">
                            <label className="text-[9px] tracking-[0.3em] text-white/40 uppercase mb-2 block transition-colors group-focus-within:text-white/70">
                                CONFIRM PASSWORD
                            </label>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full bg-transparent border-b border-white/10 py-3 text-sm text-white font-light tracking-wide outline-none transition-all focus:border-white/40 placeholder:text-white/5"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full relative py-4 text-[11px] tracking-[0.3em] text-black bg-white uppercase font-normal rounded-sm transition-all hover:bg-gray-200 active:scale-[0.98] disabled:opacity-50"
                    >
                        {isLoading ? 'UPDATING...' : 'RESET PASSWORD'}
                    </button>
                </form>
            </div>

            {/* Background Decorative Glows */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center"><div className="w-10 h-10 border-2 border-white/10 border-t-white rounded-full animate-spin" /></div>}>
            <ResetPasswordForm />
        </Suspense>
    );
}
