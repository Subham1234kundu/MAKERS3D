'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';

interface Product {
    id: string | number;
    _id?: string;
    name?: string;
    title?: string;
    price: number;
    originalPrice: number;
    category: string;
    images?: (string | { url: string; alt: string })[];
    image?: string;
}

interface CategoryShowcaseProps {
    products: Product[];
}

export default function CategoryShowcase({ products }: CategoryShowcaseProps) {
    const categories = [
        { id: 'DIVINE', label: 'DIVINE', image: '/categories/divine.png' },
        { id: 'AURA', label: 'AURA', image: '/categories/aura.png' },
        { id: 'MOTION', label: 'MOTION', image: '/categories/motion.png' },
        { id: 'BOX', label: 'BOX', image: '/categories/box.png' },
        { id: 'CUSTOM', label: 'CUSTOM', image: '/categories/custom.png' },
    ];

    const [activeCategory, setActiveCategory] = useState(categories[0].id);
    const activeIndex = categories.findIndex(cat => cat.id === activeCategory);
    const sectionRef = useRef<HTMLElement>(null);
    const productRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    const featuredProduct = products.find(p => p.category?.toUpperCase() === activeCategory);

    const handleCategoryClick = useCallback((id: string) => {
        if (id === activeCategory) return;
        setActiveCategory(id);
    }, [activeCategory]);

    const isMounted = useRef(false);

    useEffect(() => {
        if (productRef.current) {
            gsap.fromTo(productRef.current,
                { opacity: 0, scale: 0.9, y: 30, filter: 'blur(15px)' },
                { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)', duration: 1.2, ease: 'expo.out' }
            );
        }

        // Only scroll into view if this is NOT the initial mount
        // We use a separate timer to ensure layout has settled
        if (isMounted.current && listRef.current) {
            const activeElem = listRef.current.querySelector(`[data-active="true"]`);
            if (activeElem) {
                activeElem.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
        } else {
            isMounted.current = true;
        }

        return () => {
            // Reset mounted state if component unmounts (handles Strict Mode double-run)
            isMounted.current = false;
        };
    }, [activeCategory]);

    return (
        <section ref={sectionRef} className="bg-black pt-16 pb-8 lg:py-32 overflow-hidden" suppressHydrationWarning>
            <div className="max-w-7xl mx-auto px-4 sm:px-8" suppressHydrationWarning>
                {/* Mobile: Focal Portal Top | Desktop: Side-by-Side */}
                <div className="flex flex-col lg:flex-row items-center lg:items-center gap-10 sm:gap-16 lg:gap-24" suppressHydrationWarning>

                    {/* Left Side (Desktop) / Bottom (Mobile): Category Selection */}
                    <div className="w-full lg:w-1/3 order-2 lg:order-1 flex flex-col items-center lg:items-start" suppressHydrationWarning>
                        <div className="mb-4 sm:mb-12 hidden lg:block" suppressHydrationWarning>
                            <span className="text-[9px] text-white/30 tracking-[0.5em] uppercase font-light block mb-4" suppressHydrationWarning>Explore Universe</span>
                            <div className="w-12 h-[1px] bg-white/10" suppressHydrationWarning></div>
                        </div>

                        <div
                            ref={listRef}
                            className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 gap-8 sm:gap-10 lg:gap-32 w-screen lg:w-full scroll-smooth py-4 lg:py-0 relative"
                            suppressHydrationWarning
                        >
                            {/* Vertical Connection Track (Desktop) */}
                            <div className="hidden lg:block absolute left-[39px] top-10 bottom-10 w-[1px] bg-white/5 z-0" suppressHydrationWarning>
                                <div
                                    className="absolute top-0 left-0 w-full bg-white transition-all duration-1000 ease-in-out shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                                    style={{
                                        height: `${(activeIndex / (categories.length - 1)) * 100}%`,
                                        opacity: activeIndex === 0 ? 0 : 0.4
                                    }}
                                    suppressHydrationWarning
                                />
                            </div>

                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    data-active={activeCategory === cat.id}
                                    onClick={() => handleCategoryClick(cat.id)}
                                    className={`category-item group relative flex-shrink-0 lg:flex-shrink-0 transition-all duration-700 flex flex-col lg:flex-row items-center gap-3 sm:gap-6 z-10 ${activeCategory === cat.id ? 'opacity-100' : 'opacity-20 hover:opacity-50'
                                        }`}
                                    suppressHydrationWarning
                                >
                                    {/* Circular Icon with Active Glow */}
                                    <div className={`relative w-14 h-14 sm:w-20 sm:h-20 rounded-full overflow-hidden border transition-all duration-700 ${activeCategory === cat.id
                                        ? 'border-white/60 scale-110 shadow-[0_0_25px_rgba(255,255,255,0.1)]'
                                        : 'border-white/5 grayscale group-hover:grayscale-0'
                                        }`} suppressHydrationWarning>
                                        <Image
                                            src={cat.image}
                                            alt={cat.label}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 640px) 80px, 120px"
                                            quality={60}
                                            suppressHydrationWarning
                                        />

                                    </div>

                                    <div className="flex flex-col items-center lg:items-start" suppressHydrationWarning>
                                        <div className="flex items-center gap-2 lg:gap-4" suppressHydrationWarning>
                                            <span className={`text-[10px] sm:text-xs lg:text-5xl xl:text-6xl font-thin tracking-[0.2em] lg:tracking-[0.1em] uppercase transition-all duration-500 ${activeCategory === cat.id ? 'lg:translate-x-4' : ''
                                                }`} suppressHydrationWarning>
                                                {cat.label}
                                            </span>
                                            {/* Number indicator (Desktop only) */}
                                            <span className="hidden lg:inline text-[9px] font-mono text-white/20" suppressHydrationWarning>
                                                [{products.filter(p => p.category?.toUpperCase() === cat.id).length}]
                                            </span>
                                        </div>

                                        {/* Active Line Decoration (Desktop) */}
                                        <div className={`hidden lg:block h-[1px] bg-white transition-all duration-700 mt-2 ${activeCategory === cat.id ? 'w-full opacity-30' : 'w-0 opacity-0'
                                            }`} suppressHydrationWarning></div>
                                    </div>

                                    {/* Mobile Active Pulse Indicator */}
                                    {activeCategory === cat.id && (
                                        <div className="lg:absolute lg:-left-4 w-1 h-1 lg:h-full bg-white opacity-40 rounded-full animate-pulse mt-2 lg:mt-0" suppressHydrationWarning></div>
                                    )}
                                </button>
                            ))}

                            {/* View All Masterpieces */}
                            <Link
                                href="/products"
                                className="group relative flex-shrink-0 transition-all duration-500 flex flex-col lg:flex-row items-center gap-3 sm:gap-6 opacity-30 hover:opacity-100 py-2 lg:py-0"
                                suppressHydrationWarning
                            >
                                <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white/10 group-hover:border-white transition-all duration-500" suppressHydrationWarning>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-white">
                                        <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <span className="text-[9px] font-light tracking-[0.4em] uppercase text-white" suppressHydrationWarning>
                                    Explore All
                                </span>
                            </Link>
                        </div>
                    </div>

                    {/* Right Side (Desktop) / Top (Mobile): Featured Product Portal */}
                    <div className="w-full lg:w-2/3 relative order-1 lg:order-2" suppressHydrationWarning>
                        {/* Immersive Background Elements */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-white/[0.02] blur-[100px] sm:blur-[150px] rounded-full pointer-events-none" suppressHydrationWarning></div>

                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-12 lg:hidden" suppressHydrationWarning>
                            <span className="text-[8px] text-white/30 tracking-[1em] uppercase font-thin whitespace-nowrap" suppressHydrationWarning>Featured Masterpiece</span>
                        </div>

                        <div ref={productRef} className="relative h-[350px] sm:h-[600px] lg:h-[750px] w-full flex items-center justify-center" suppressHydrationWarning>
                            {/* Celestial Rotating Rings */}
                            <div className="absolute inset-x-0 inset-y-0 border border-white/[0.04] rounded-full animate-[spin_25s_linear_infinite] scale-[1.1] pointer-events-none" suppressHydrationWarning></div>
                            <div className="absolute inset-8 sm:inset-16 border border-white/[0.02] rounded-full animate-[spin_35s_linear_infinite_reverse] scale-[0.95] pointer-events-none" suppressHydrationWarning></div>

                            {featuredProduct ? (
                                <Link href={`/products/${featuredProduct.id || featuredProduct._id}`} className="group relative block w-full h-full max-w-[280px] max-h-[280px] sm:max-w-[550px] sm:max-h-[550px]" suppressHydrationWarning>
                                    <div className="relative h-full w-full overflow-hidden rounded-full bg-white/[0.02] border border-white/5 group-hover:border-white/10 transition-all duration-1000 shadow-[0_0_100px_rgba(0,0,0,0.6)]" suppressHydrationWarning>
                                        <Image
                                            src={typeof featuredProduct.images?.[0] === 'string' ? featuredProduct.images[0] : (featuredProduct.image || '/placeholder.png')}
                                            alt={featuredProduct.name || featuredProduct.title || 'Featured'}
                                            fill
                                            className="object-cover object-center transition-transform duration-[2000ms] group-hover:scale-110"
                                            sizes="(max-width: 640px) 280px, (max-width: 1024px) 550px, 600px"
                                            priority
                                            suppressHydrationWarning
                                        />

                                        {/* Cinematic Light Sweep */}
                                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full -translate-y-full group-hover:translate-x-full group-hover:translate-y-full transition-transform duration-[1500ms] ease-in-out" suppressHydrationWarning></div>

                                        {/* Depth Blur Overlay (Touch Optimized) */}
                                        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-700 bg-black/60 backdrop-blur-[3px]" suppressHydrationWarning>
                                            <div className="text-center px-6" suppressHydrationWarning>
                                                <h4 className="text-white text-base sm:text-4xl font-thin tracking-[0.1em] uppercase mb-2 sm:mb-4" suppressHydrationWarning>
                                                    {featuredProduct.name || featuredProduct.title}
                                                </h4>
                                                <span className="text-white/60 font-light tracking-widest text-[10px] sm:text-xl block mb-4 sm:mb-8" suppressHydrationWarning>
                                                    ₹{featuredProduct.price.toLocaleString('en-IN')}
                                                </span>
                                                <div className="inline-block px-4 py-1.5 sm:px-8 sm:py-3 border border-white/10 text-[7px] sm:text-[10px] tracking-[0.5em] text-white/90 uppercase hover:bg-white hover:text-black transition-all" suppressHydrationWarning>
                                                    Enquire Details
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ) : (
                                <div className="h-full w-full max-w-[280px] max-h-[280px] sm:max-w-[550px] sm:max-h-[550px] flex flex-col items-center justify-center border border-white/5 rounded-full bg-white/[0.01] overflow-hidden" suppressHydrationWarning>
                                    <div className="relative w-full h-full flex flex-col items-center justify-center gap-6" suppressHydrationWarning>
                                        <div className="w-12 h-12 border border-white/10 rounded-full flex items-center justify-center animate-pulse" suppressHydrationWarning>
                                            <div className="w-2 h-2 bg-white/20 rounded-full" suppressHydrationWarning></div>
                                        </div>
                                        <span className="text-white/10 text-[7px] sm:text-[10px] tracking-[1em] uppercase font-thin text-center px-12 leading-relaxed" suppressHydrationWarning>
                                            COMING SOON<br /><span className="mt-2 block opacity-40 text-[6px]">MASTERY IN PROGRESS</span>
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* WATERMARK LABEL */}
                        <div className="absolute -right-8 -top-8 text-[120px] font-black text-white/[0.02] select-none pointer-events-none hidden lg:block uppercase italic" suppressHydrationWarning>
                            {activeCategory}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
