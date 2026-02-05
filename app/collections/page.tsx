'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface Collection {
    id: string;
    name: string;
    description: string;
    image: string;
    slug: string;
    order: number;
}

export default function CollectionsPage() {
    const [collections, setCollections] = useState<Collection[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        fetchCollections();
    }, []);

    const fetchCollections = async () => {
        try {
            const res = await fetch('/api/collections');
            if (res.ok) {
                const data = await res.json();
                setCollections(data);
            }
        } catch (error) {
            console.error('Error fetching collections:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!isLoading && titleRef.current) {
            // Animate title
            gsap.fromTo(titleRef.current,
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
            );

            // Animate collection cards
            gsap.fromTo('.collection-card',
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power2.out', delay: 0.3 }
            );
        }
    }, [isLoading]);

    return (
        <>
            <Navbar />

            <main className="bg-black min-h-screen text-white pt-28 sm:pt-32 pb-20 px-4 sm:px-8">
                <div ref={containerRef} className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center  sm:mb-12">
                        <span className="text-[10px] sm:text-xs font-light uppercase tracking-[0.4em] text-white/40 mb-2 block">
                            Explore
                        </span>
                        <h1 ref={titleRef} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-thin tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                            OUR COLLECTIONS
                        </h1>
                    </div>

                    {/* Collections Grid */}
                    {isLoading ? (
                        <div className="flex items-center justify-center py-24">
                            <div className="w-6 h-6 border border-white/20 border-t-white/60 animate-spin rounded-full" />
                        </div>
                    ) : collections.length === 0 ? (
                        <div className="text-center py-24">
                            <p className="text-white/30 text-[10px] uppercase tracking-[0.3em] font-light">
                                No collections available yet
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                            {collections.map((collection) => (
                                <Link
                                    key={collection.id}
                                    href={`/products?category=${collection.slug.toUpperCase()}`}
                                    className="collection-card group"
                                >
                                    <div className="relative overflow-hidden bg-neutral-900/30 border border-white/[0.08] hover:border-white/20 transition-all duration-700">
                                        {/* Image */}
                                        <div className="aspect-[4/5] relative overflow-hidden bg-neutral-900">
                                            {collection.image ? (
                                                <img
                                                    src={collection.image}
                                                    alt={collection.name}
                                                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-white/10">
                                                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                            )}

                                            {/* Gradient Overlay - always visible, intensifies on hover */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                                            {/* Collection Name Overlay */}
                                            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                                                <h2 className="text-lg sm:text-xl font-thin tracking-[0.2em] uppercase text-white mb-1 group-hover:tracking-[0.25em] transition-all duration-500">
                                                    {collection.name}
                                                </h2>
                                                {collection.description && (
                                                    <p className="text-[10px] sm:text-xs text-white/50 font-light leading-relaxed line-clamp-2 max-w-[90%]">
                                                        {collection.description}
                                                    </p>
                                                )}

                                                {/* View Collection CTA */}
                                                <div className="mt-4 flex items-center gap-2 text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-white/40 group-hover:text-white/80 transition-all duration-300">
                                                    <span className="border-b border-transparent group-hover:border-white/40 pb-0.5 transition-all duration-300">Explore</span>
                                                    <svg className="w-3 h-3 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </>
    );
}
