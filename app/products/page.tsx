'use client';

import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';
import { gsap } from 'gsap';

export default function ProductsPage() {
    const [activeCategory, setActiveCategory] = useState('ALL');

    // Categories aligned with Home Page
    const categories = ['ALL', 'MODELS', 'FRAMES', 'LAMP', 'DESK ORGANIZER', 'HOME DECORS'];

    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch('/api/products');
                if (res.ok) {
                    const data = await res.json();
                    setProducts(data);
                }
            } catch (error) {
                console.error('Fetch products error:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Animation on load
    useEffect(() => {
        // Reveal text
        gsap.fromTo('.page-title',
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
        );

        gsap.fromTo('.category-bar',
            { opacity: 0 },
            { opacity: 1, duration: 1, delay: 0.3 }
        );
    }, []);

    // Filter products
    const filteredProducts = activeCategory === 'ALL'
        ? products
        : products.filter(p => p.category === activeCategory);

    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-black pt-32 pb-20 px-4 sm:px-8">
                <div className="max-w-7xl mx-auto">

                    {/* Header */}
                    <div className="text-center mb-16 page-title">
                        <h1 className="text-4xl md:text-6xl font-thin tracking-wider text-white mb-4">
                            OUR COLLECTIONS
                        </h1>
                        <p className="text-white/40 font-light tracking-widest text-sm uppercase">
                            Curated 3D Printed Masterpieces
                        </p>
                    </div>

                    {/* Sticky Category Filter */}
                    <div className="sticky top-20 z-40 bg-black/80 backdrop-blur-md py-4 mb-12 category-bar border-b border-white/10">
                        <div className="flex overflow-x-auto no-scrollbar items-center justify-start sm:justify-center gap-8 px-4">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setActiveCategory(category)}
                                    className={`text-xs sm:text-sm font-thin tracking-widest transition-all duration-300 whitespace-nowrap hover:text-white ${activeCategory === category ? 'text-white scale-110 font-normal' : 'text-white/40'
                                        }`}
                                >
                                    {category}
                                    {activeCategory === category && (
                                        <div className="h-[1px] bg-white w-full mt-1 animate-underline" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Grid */}
                    {isLoading ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-8">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                <div key={i} className="aspect-square bg-white/5 animate-pulse rounded-sm" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-8">
                            {filteredProducts.map((product) => (
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
                    )}

                    {/* Empty State */}
                    {filteredProducts.length === 0 && (
                        <div className="text-center py-32 text-white/30 font-thin tracking-widest">
                            NO PRODUCTS FOUND IN THIS CATEGORY
                        </div>
                    )}
                </div>
            </main>

            <Footer />

            <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes underline {
            from { transform: scaleX(0); }
            to { transform: scaleX(1); }
        }
        .animate-underline {
            transform-origin: left;
            animation: underline 0.3s ease-out forwards;
        }
      `}</style>
        </>
    );
}
