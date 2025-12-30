'use client';

import { useState, useEffect, useRef } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';

const ParticleCubeLogo = dynamic(() => import('../components/ParticleCubeLogo'), {
    ssr: false,
    loading: () => <div style={{ width: '60px', height: '60px' }} />
});

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();
    const containerRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Initial entrance animation
        const ctx = gsap.context(() => {
            gsap.fromTo(formRef.current,
                { opacity: 0, y: 20, filter: 'blur(10px)' },
                { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.2, ease: 'power3.out', delay: 0.2 }
            );
        }, containerRef);

        return () => ctx.revert();
    }, []);

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const result = await signIn('credentials', {
                redirect: false,
                email,
                password,
            });

            if (result?.error) {
                setError('INVALID CREDENTIALS');
                gsap.to(formRef.current, { x: 10, duration: 0.1, yoyo: true, repeat: 5, ease: 'power2.inOut' });
            } else {
                // Admin Redirect Check
                if (email === 'subhamkundu999@gmail.com' || email === 'admin@makers3d.com') {
                    router.push('/dashboard');
                } else {
                    router.push('/');
                }
            }
        } catch (err) {
            setError('SOMETHING WENT WRONG');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        signIn('google', { callbackUrl: '/' });
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
                        LOG IN
                    </h1>
                    <p className="text-[10px] tracking-[0.3em] text-white/30 uppercase">
                        Access your 3D creative space
                    </p>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="text-[10px] tracking-widest text-red-500/80 text-center uppercase mb-8 animate-pulse">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleEmailLogin} className="space-y-8">
                    <div className="space-y-6">
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

                        <label className="text-[9px] tracking-[0.3em] text-white/40 uppercase mb-2 block transition-colors group-focus-within:text-white/70">
                            PASSWORD
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

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full relative py-4 text-[11px] tracking-[0.3em] text-black bg-white uppercase font-normal rounded-sm transition-all hover:bg-gray-200 active:scale-[0.98] disabled:opacity-50"
                    >
                        {isLoading ? 'VERIFYING...' : 'SIGN IN'}
                    </button>
                </form>

                {/* Optional Google Login */}
                <div className="mt-10 space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="h-[1px] flex-1 bg-white/5"></div>
                        <span className="text-[9px] tracking-[0.4em] text-white/20 uppercase">OR</span>
                        <div className="h-[1px] flex-1 bg-white/5"></div>
                    </div>

                    <button
                        onClick={handleGoogleLogin}
                        className="w-full py-4 text-[10px] tracking-[0.2em] text-white bg-transparent border border-white/10 uppercase font-light rounded-sm transition-all hover:bg-white/5 hover:border-white/20 flex items-center justify-center gap-3"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" className="opacity-70">
                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        CONTINUE WITH GOOGLE
                    </button>
                </div>

                {/* Signup Link */}
                <div className="mt-12 text-center">
                    <Link href="/signup" className="text-[10px] tracking-[0.2em] text-white/40 hover:text-white uppercase transition-colors">
                        NEW HERE? <span className="text-white border-b border-white/30 ml-1">CREATE ACCOUNT</span>
                    </Link>
                </div>
            </div>

            {/* Background Decorative Glows */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>
        </div>
    );
}

