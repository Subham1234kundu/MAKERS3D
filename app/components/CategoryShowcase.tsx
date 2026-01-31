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
        { id: 'ASH_AND_STONE', label: 'ASH & STONE', image: '/categories/ash_and_stone.png' },
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

        // Handle mobile scroll-to-active only on category click
        if (isMounted.current && listRef.current && window.innerWidth < 1024) {
            const activeElem = listRef.current.querySelector(`[data-active="true"]`);
            if (activeElem) {
                activeElem.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
        }

        isMounted.current = true;
    }, [activeCategory]);

    // Natural Scroll Switching (Non-locking)
    useEffect(() => {
        // Desktop: Switch based on scroll progress within section
        const handleDesktopScroll = () => {
            if (window.innerWidth < 1024 || !sectionRef.current) return;

            const rect = sectionRef.current.getBoundingClientRect();
            const sectionHeight = rect.height;
            const scrollVisible = window.innerHeight;

            // Start the transition logic slightly later (offset by 0.15)
            // This ensures the first category stays active longer as you enter the section
            const rawProgress = (scrollVisible - rect.top) / (sectionHeight + scrollVisible);
            const scrollOffset = 0.15; // Delay start
            const progress = Math.max(0, Math.min(1, (rawProgress - scrollOffset) / (1 - scrollOffset)));

            if (rawProgress > scrollOffset && rawProgress < 1) {
                const totalCategories = categories.length;
                const index = Math.min(Math.floor(progress * totalCategories), totalCategories - 1);

                if (categories[index].id !== activeCategory) {
                    setActiveCategory(categories[index].id);
                }
            } else if (rawProgress <= scrollOffset) {
                // Ensure first category is reset if we scroll back up
                if (activeCategory !== categories[0].id) {
                    setActiveCategory(categories[0].id);
                }
            }
        };

        // Mobile: Scroll-Spy for the horizontal list
        const handleMobileScroll = () => {
            if (window.innerWidth >= 1024 || !listRef.current) return;
            const container = listRef.current;
            const items = container.querySelectorAll('.category-item');
            let closestId = activeCategory;
            let minDistance = Infinity;
            const containerCenter = container.getBoundingClientRect().left + container.offsetWidth / 2;

            items.forEach((item) => {
                const htmlItem = item as HTMLElement;
                const rect = htmlItem.getBoundingClientRect();
                const itemCenter = rect.left + rect.width / 2;
                const distance = Math.abs(containerCenter - itemCenter);

                if (distance < minDistance) {
                    minDistance = distance;
                    closestId = htmlItem.getAttribute('data-id') || activeCategory;
                }
            });

            if (closestId !== activeCategory) {
                setActiveCategory(closestId);
            }
        };

        window.addEventListener('scroll', handleDesktopScroll, { passive: true });
        const mobileContainer = listRef.current;
        if (mobileContainer) {
            mobileContainer.addEventListener('scroll', handleMobileScroll, { passive: true });
        }

        return () => {
            window.removeEventListener('scroll', handleDesktopScroll);
            if (mobileContainer) {
                mobileContainer.removeEventListener('scroll', handleMobileScroll);
            }
        };
    }, [activeCategory, categories]);

    return (
        <section ref={sectionRef} className="bg-black pt-16 pb-8 lg:py-24 overflow-hidden" suppressHydrationWarning>
            <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto px-4 sm:px-8" suppressHydrationWarning>
                {/* Mobile: Focal Portal Top | Desktop: Side-by-Side */}
                <div className="flex flex-col lg:flex-row items-center lg:justify-between gap-6 sm:gap-16 lg:gap-0" suppressHydrationWarning>

                    {/* Left Side (Desktop) / Bottom (Mobile): Category Selection */}
                    <div className="w-full lg:w-[25%] 2xl:w-[35%] order-2 lg:order-1 flex flex-col items-center lg:items-start" suppressHydrationWarning>
                        <div className="mb-4 sm:mb-12 hidden lg:block" suppressHydrationWarning>
                            <span className="text-[9px] 2xl:text-base text-white/30 tracking-[0.5em] uppercase font-light block mb-4" suppressHydrationWarning>Explore Universe</span>
                            <div className="w-12 2xl:w-24 h-[1px] bg-white/10" suppressHydrationWarning></div>
                        </div>

                        <div
                            ref={listRef}
                            className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 gap-4 sm:gap-10 lg:gap-16 w-screen lg:w-full scroll-smooth py-4 lg:py-0 relative"
                            suppressHydrationWarning
                        >
                            {/* Vertical Connection Track (Desktop) */}
                            <div className="hidden lg:block absolute left-[40px] top-10 bottom-10 w-[1px] bg-white/5 z-0" suppressHydrationWarning>
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
                                    data-id={cat.id}
                                    data-active={activeCategory === cat.id}
                                    onClick={() => handleCategoryClick(cat.id)}
                                    className={`category-item group relative flex-shrink-0 lg:flex-shrink-0 transition-all duration-700 flex flex-col lg:flex-row items-center 2xl:justify-between gap-3 sm:gap-6 z-10 w-24 lg:w-full ${activeCategory === cat.id ? 'opacity-100' : 'opacity-40 hover:opacity-100'
                                        }`}
                                    suppressHydrationWarning
                                >
                                    {/* Architectural Icon Box - Rounded on Mobile */}
                                    <div className={`relative flex-shrink-0 w-14 h-14 sm:w-20 sm:h-20 2xl:w-32 2xl:h-32 overflow-hidden border transition-all duration-700 rounded-full lg:rounded-none ${activeCategory === cat.id
                                        ? 'border-white/60 scale-110 shadow-[0_0_25px_rgba(255,255,255,0.1)]'
                                        : 'border-white/20 grayscale-[50%] group-hover:grayscale-0 group-hover:border-white/40'
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
                                            <span className={`text-[10px] sm:text-xs lg:text-3xl xl:text-5xl 2xl:text-7xl font-thin tracking-[0.3em] uppercase italic transition-all duration-700 whitespace-nowrap ${activeCategory === cat.id ? 'lg:translate-x-6 text-white' : 'text-white/60'
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
                                className="group relative flex-shrink-0 transition-all duration-500 flex flex-col lg:flex-row items-center gap-3 sm:gap-6 opacity-100 py-2 lg:py-0 w-24 lg:w-full"
                                suppressHydrationWarning
                            >
                                <div className="flex-shrink-0 w-14 h-14 sm:w-20 sm:h-20 overflow-hidden rounded-full lg:rounded-none border border-white/40 flex items-center justify-center group-hover:bg-white/10 group-hover:border-white transition-all duration-500" suppressHydrationWarning>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-white">
                                        <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <span className="text-[9px] font-bold tracking-[0.4em] uppercase text-white" suppressHydrationWarning>
                                    Explore All
                                </span>
                            </Link>
                        </div>
                    </div>

                    {/* Right Side (Desktop) / Top (Mobile): Featured Product Portal */}
                    <div className="w-full lg:w-1/2 2xl:w-[60%] relative order-1 lg:order-2 h-[450px] sm:h-[600px] lg:h-[750px] 2xl:h-[900px] flex justify-center lg:justify-end" suppressHydrationWarning>
                        {/* Immersive Background Glow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160%] h-[160%] bg-white/[0.01] blur-[150px] rounded-full pointer-events-none" suppressHydrationWarning></div>

                        <div ref={productRef} className="relative h-full w-full max-w-[600px] 2xl:max-w-[1000px] flex items-center justify-center" suppressHydrationWarning>
                            {/* Sharp Architectural Framing */}
                            <div className="absolute inset-x-0 inset-y-0 border border-white/[0.05] pointer-events-none z-10" suppressHydrationWarning></div>
                            <div className="absolute inset-x-4 inset-y-4 border border-white/[0.02] pointer-events-none z-10" suppressHydrationWarning></div>

                            {featuredProduct ? (
                                <Link href={`/products/${featuredProduct.id || featuredProduct._id}`} className="group relative block w-full h-full" suppressHydrationWarning>
                                    <div className="relative h-full w-full overflow-hidden bg-white/[0.02] transition-all duration-1000 shadow-[0_40px_120px_rgba(0,0,0,0.9)]" suppressHydrationWarning>
                                        {/* Dynamic Collection Image - No Border Radius */}
                                        {(() => {
                                            const imageData = featuredProduct.images?.[0] || featuredProduct.image;
                                            const imageUrl = typeof imageData === 'object' ? imageData?.url : imageData;
                                            return (
                                                <Image
                                                    src={imageUrl || '/placeholder.png'}
                                                    alt={featuredProduct.name || featuredProduct.title || 'Featured'}
                                                    fill
                                                    className="object-cover object-center transition-transform duration-[4000ms] group-hover:scale-110"
                                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 800px"
                                                    priority
                                                    suppressHydrationWarning
                                                />
                                            );
                                        })()}

                                        {/* Cinematic Permanent Branding Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent flex flex-col justify-end p-6 sm:p-10 lg:p-14 z-20" suppressHydrationWarning>
                                            <div className="max-w-xl" suppressHydrationWarning>
                                                <div className="flex items-center gap-3 mb-3 overflow-hidden" suppressHydrationWarning>
                                                    <div className="h-[1px] w-6 bg-white/40 animate-[slideRight_1s_ease-out_forwards]" suppressHydrationWarning></div>
                                                    <span className="text-white/40 text-[7px] sm:text-[8px] 2xl:text-sm tracking-[0.8em] uppercase font-light block" suppressHydrationWarning>
                                                        Masterpiece Series
                                                    </span>
                                                </div>

                                                <h4 className="text-white text-2xl sm:text-4xl lg:text-5xl 2xl:text-7xl font-thin tracking-tight uppercase mb-6 leading-[1.05]" suppressHydrationWarning>
                                                    {featuredProduct.name || featuredProduct.title}
                                                </h4>

                                                <div className="group/btn relative inline-flex items-center gap-4 py-2" suppressHydrationWarning>
                                                    <span className="text-white text-[8px] sm:text-[9px] 2xl:text-sm tracking-[0.6em] uppercase font-bold transition-all duration-500 group-hover:tracking-[0.8em]" suppressHydrationWarning>
                                                        Explore Geometry
                                                    </span>
                                                    <div className="w-10 h-[1px] bg-white transition-all duration-500 group-hover:w-20 group-hover:bg-white/100" suppressHydrationWarning></div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Subtle Atmospheric Flare - Interactive */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" suppressHydrationWarning></div>
                                    </div>
                                </Link>
                            ) : (
                                <div className="h-full w-full flex flex-col items-center justify-center bg-transparent overflow-hidden" suppressHydrationWarning>
                                    <div className="relative w-full h-full flex flex-col items-center justify-center gap-2" suppressHydrationWarning>
                                        <span className="text-white/5 text-4xl sm:text-6xl lg:text-7xl font-black tracking-[0.2em] uppercase italic absolute select-none pointer-events-none" suppressHydrationWarning>
                                            {activeCategory}
                                        </span>
                                        <div className="relative z-10 flex flex-col items-center" suppressHydrationWarning>
                                            <span className="text-white text-[10px] sm:text-xs tracking-[1.2em] uppercase font-thin mb-4 opacity-40" suppressHydrationWarning>
                                                Coming Soon
                                            </span>
                                            <h4 className="text-white/80 text-3xl sm:text-5xl lg:text-6xl 2xl:text-8xl font-thin tracking-tighter uppercase italic leading-none" suppressHydrationWarning>
                                                Under<br />Fabrication
                                            </h4>
                                            <div className="w-12 h-[1px] bg-white/20 mt-8" suppressHydrationWarning></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* HIGH-FASHION VERTICAL WATERMARK */}
                        <div className="absolute -right-20 top-1/2 -translate-y-1/2 rotate-90 text-[140px] font-black text-white/[0.02] select-none pointer-events-none hidden lg:block uppercase italic leading-none whitespace-nowrap" suppressHydrationWarning>
                            {activeCategory}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
