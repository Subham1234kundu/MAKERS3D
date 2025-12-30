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

            <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-32 pb-20">
                <div className="mb-12">
                    <h1 className="text-4xl md:text-6xl font-thin tracking-tighter mb-4">YOUR WISHLIST</h1>
                    <p className="text-white/40 font-thin tracking-widest text-xs uppercase">Items you've manifested interest in</p>
                </div>

                {likedProducts.length > 0 ? (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
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
                    <div className="flex flex-col items-center justify-center py-32 border border-white/5 bg-white/[0.02]">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="0.5" className="mb-6 opacity-20">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                        <p className="text-white/30 font-thin tracking-[0.3em] uppercase text-xs mb-8">Your collection is currently empty</p>
                        <Link href="/" className="px-10 py-4 border border-white/20 text-[10px] uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-500">
                            Discover Masterpieces
                        </Link>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
