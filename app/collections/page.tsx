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

            <main className="bg-black min-h-screen text-white pt-32 pb-20 px-4 sm:px-8">
                <div ref={containerRef} className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <h1 ref={titleRef} className="text-4xl md:text-6xl font-thin tracking-wider text-white mb-4">
                            OUR COLLECTIONS
                        </h1>
                        <p className="text-white/40 font-light tracking-widest text-xs uppercase">
                            Explore our curated design collections
                        </p>
                    </div>

                    {/* Collections Grid */}
                    {isLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="w-8 h-8 border-2 border-white/20 border-t-white animate-spin rounded-full" />
                        </div>
                    ) : collections.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-white/40 text-sm uppercase tracking-widest">
                                No collections available yet
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {collections.map((collection) => (
                                <Link
                                    key={collection.id}
                                    href={`/products?category=${collection.slug.toUpperCase()}`}
                                    className="collection-card group"
                                >
                                    <div className="relative overflow-hidden bg-neutral-900/20 border border-white/5 hover:border-white/20 transition-all duration-500">
                                        {/* Image */}
                                        <div className="aspect-[4/5] relative overflow-hidden bg-neutral-800">
                                            {collection.image ? (
                                                <img
                                                    src={collection.image}
                                                    alt={collection.name}
                                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-white/20">
                                                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                            )}

                                            {/* Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        </div>

                                        {/* Content */}
                                        <div className="p-6 border-t border-white/5">
                                            <h2 className="text-xl font-light tracking-widest text-white mb-2 group-hover:text-white/60 transition-colors">
                                                {collection.name}
                                            </h2>
                                            {collection.description && (
                                                <p className="text-xs text-white/40 font-light leading-relaxed">
                                                    {collection.description}
                                                </p>
                                            )}

                                            {/* View Collection CTA */}
                                            <div className="mt-4 flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">
                                                <span>View Collection</span>
                                                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
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
