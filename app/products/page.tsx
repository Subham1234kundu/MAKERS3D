'use client';

import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';
import { gsap } from 'gsap';

export default function ProductsPage() {
    const [activeCategory, setActiveCategory] = useState('ALL');

    // Categories aligned with Home Page
    const categoryData = [
        { id: 'ALL', label: 'SHOP', image: '/categories/all.png' },
        { id: 'DIVINE', label: 'DIVINE', image: '/categories/divine.png' },
        { id: 'AURA', label: 'AURA', image: '/categories/aura.png' },
        { id: 'MOTION', label: 'MOTION', image: '/categories/motion.png' },
        { id: 'BOX', label: 'BOX', image: '/categories/box.png' },
        { id: 'CUSTOM', label: 'CUSTOM', image: '/categories/custom.png' },
    ];

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
        : products.filter(p => p.category?.toUpperCase() === activeCategory);

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

                    {/* Sticky Category Filter - Circular Style */}
                    <div className="sticky top-0 z-40 bg-black/80 backdrop-blur-md py-4 mb-12 category-bar border-b border-white/10">
                        <div className="flex overflow-x-auto overflow-y-visible no-scrollbar items-center justify-start sm:justify-center gap-6 sm:gap-10 px-4 py-10">
                            {categoryData.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.id)}
                                    className="flex-shrink-0 flex flex-col items-center gap-3 transition-all active:scale-95 group/cat"
                                >
                                    <div className={`w-[60px] h-[60px] sm:w-[75px] sm:h-[75px] rounded-full flex items-center justify-center transition-all duration-500 overflow-hidden relative ${activeCategory === cat.id
                                        ? 'bg-white border-[3px] border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.15)] scale-110'
                                        : 'bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10'
                                        }`}>
                                        <img
                                            src={cat.image}
                                            alt={cat.label}
                                            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 grayscale hover:grayscale-0 ${activeCategory === cat.id ? 'grayscale-0 opacity-100 scale-110' : 'opacity-60 group-hover/cat:opacity-100'
                                                }`}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover/cat:opacity-100 transition-opacity pointer-events-none"></div>
                                    </div>
                                    <span className={`text-[9px] sm:text-[10px] font-bold tracking-[0.15em] uppercase transition-colors duration-300 ${activeCategory === cat.id ? 'text-white' : 'text-white/30 group-hover/cat:text-white/60'
                                        }`}>
                                        {cat.id}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Grid */}
                    {isLoading ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-2.5 gap-y-6 sm:gap-6">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                <div key={i} className="aspect-square bg-white/5 animate-pulse rounded-sm" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-2.5 gap-y-6 sm:gap-6">
                            {filteredProducts.map((product) => {
                                const firstImage = typeof product.images?.[0] === 'string' ? product.images[0] : (product.images?.[0]?.url || product.image);
                                const firstAlt = typeof product.images?.[0] === 'object' ? product.images[0].alt : product.name;

                                // Extract second image for hover effect
                                const secondImage = product.images?.[1] ? (typeof product.images[1] === 'string' ? product.images[1] : product.images[1]?.url) : undefined;
                                const secondAlt = typeof product.images?.[1] === 'object' ? product.images[1].alt : `${product.name} - view 2`;

                                return (
                                    <ProductCard
                                        key={product.id}
                                        id={product.id}
                                        image={firstImage}
                                        alt={firstAlt}
                                        secondImage={secondImage}
                                        secondAlt={secondAlt}
                                        title={product.name || product.title}
                                        price={product.price}
                                        originalPrice={product.originalPrice}
                                    />
                                );
                            })}
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
