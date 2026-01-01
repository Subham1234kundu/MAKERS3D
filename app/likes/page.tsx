'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import Link from 'next/link';

export default function LikesPage() {
    const { data: session, status } = useSession();
    const [likedProducts, setLikedProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (status === 'authenticated') {
            fetchLikes();
        } else if (status === 'unauthenticated') {
            setIsLoading(false);
        }
    }, [status]);

    const fetchLikes = async () => {
        try {
            const res = await fetch('/api/likes');
            if (res.ok) {
                const data = await res.json();
                setLikedProducts(data);
            }
        } catch (error) {
            console.error('Error fetching likes:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (status === 'loading' || isLoading) {
        return (
            <div className="bg-black min-h-screen text-white flex items-center justify-center">
                <div className="text-xl font-thin tracking-widest animate-pulse">RETRIVING YOUR FAVORITES...</div>
            </div>
        );
    }

    return (
        <div className="bg-black min-h-screen text-white">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-24 sm:pt-32 pb-32 sm:pb-20">
                <div className="mb-10 sm:mb-16 flex flex-col items-center sm:items-start text-center sm:text-left animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <h1 className="text-3xl sm:text-5xl md:text-7xl font-thin tracking-tighter mb-4 uppercase">
                        Your <span className="font-extrabold italic text-white/90">Wishlist</span>
                    </h1>
                    <div className="flex items-center gap-3">
                        <div className="h-[1px] w-8 bg-white/20 hidden sm:block"></div>
                        <p className="text-white/40 font-bold tracking-[0.2em] text-[10px] sm:text-xs uppercase">
                            Collection of envisioned masterpieces
                        </p>
                    </div>
                </div>

                {likedProducts.length > 0 ? (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-8 sm:gap-8 animate-in fade-in duration-1000 delay-300">
                        {likedProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                id={product.id}
                                image={product.images?.[0] || product.image}
                                title={product.name || product.title}
                                price={product.price}
                                originalPrice={product.originalPrice}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-24 sm:py-32 border border-white/5 bg-white/[0.01] rounded-3xl backdrop-blur-sm animate-in zoom-in duration-700">
                        <div className="relative mb-8">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-white/20">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                            </svg>
                            <div className="absolute inset-0 bg-white/10 blur-2xl rounded-full opacity-20"></div>
                        </div>
                        <p className="text-white/30 font-bold tracking-[0.3em] uppercase text-[10px] mb-8 max-w-[200px] text-center leading-relaxed">
                            Your conceptual collection is currently empty
                        </p>
                        <Link href="/" className="group relative px-10 py-4 overflow-hidden">
                            <div className="absolute inset-0 border border-white/20 group-hover:border-white transition-colors duration-500"></div>
                            <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                            <span className="relative z-10 text-[10px] uppercase tracking-[0.2em] text-white group-hover:text-black transition-colors duration-500">
                                Discover Masterpieces
                            </span>
                        </Link>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
