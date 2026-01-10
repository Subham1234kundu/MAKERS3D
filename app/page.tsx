'use client';

import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import Footer from './components/Footer';
import ExperienceSection from './components/ExperienceSection';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Force scroll to top on refresh
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    // Tiny delay to ensure DOM is ready
    const scrollReset = setTimeout(() => window.scrollTo(0, 0), 10);

    let ctx: any;

    const setupAnimations = async () => {
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      if (!titleRef.current || !subtitleRef.current || !ctaRef.current || !heroRef.current) return;

      // Create a context for easy cleanup
      ctx = gsap.context(() => {
        // Initial Styles
        gsap.set([titleRef.current, subtitleRef.current, ctaRef.current], {
          force3D: true,
          willChange: 'transform, opacity'
        });

        // 1. Initial Entry Animation
        const entryTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        entryTl.fromTo(titleRef.current,
          { opacity: 0, y: 30, filter: 'blur(8px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1, delay: 0.3 }
        )
          .fromTo(subtitleRef.current,
            { opacity: 0, y: 15, filter: 'blur(4px)' },
            { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8 },
            '-=0.7'
          )
          .fromTo(ctaRef.current,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.8 },
            '-=0.6'
          );

        // 2. Scroll Animation - EXPLICIT fromTo to guarantee appearance on scroll up
        const scrollTl = gsap.timeline({
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom 40%',
            scrub: 1,
            invalidateOnRefresh: true,
          }
        });

        scrollTl.fromTo([titleRef.current, subtitleRef.current, ctaRef.current],
          { opacity: 1, y: 0, visibility: 'visible' },
          {
            opacity: 0,
            y: -120,
            stagger: 0.05,
            ease: 'none',
            immediateRender: false
          }
        );

        // 4. Floating Orbs Animation
        gsap.to('.hero-orb-1', {
          x: '15%',
          y: '10%',
          duration: 8,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
        gsap.to('.hero-orb-2', {
          x: '-10%',
          y: '-15%',
          duration: 10,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: 1
        });
      }, heroRef);
    };

    setupAnimations();

    return () => {
      clearTimeout(scrollReset);
      if (ctx) ctx.revert();
    };
  }, []);

  const categories = ['ALL', 'MODELS', 'FRAMES', 'LAMP', 'DESK ORGANIZER', 'HOME DECORS'];

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
  };

  const [products, setProducts] = useState<any[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

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
        setIsLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = activeCategory === 'ALL'
    ? products
    : products.filter(p => p.category?.toUpperCase() === activeCategory);

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <div ref={heroRef} className="relative min-h-[95vh] sm:min-h-[calc(100vh-70px)] bg-black flex items-center justify-center overflow-hidden px-4 sm:px-8 pt-32 pb-20 sm:py-12 border-b border-white/[0.05] sm:border-none" suppressHydrationWarning>
        <div className="relative z-10 text-center max-w-[1000px] w-full" suppressHydrationWarning>
          {/* Main Heading - Highly Aesthetic Editorial Typography */}
          <h1 ref={titleRef}
            className="text-[2.6rem] sm:text-6xl md:text-8xl lg:text-[10rem] font-thin leading-[1.1] sm:leading-[0.9] mb-8 md:mb-14 tracking-[-0.04em] font-sans selection:bg-white selection:text-black mt-4 md:mt-16 lg:mt-32 cursor-none"
            data-cursor-size="large">
            <span className="block opacity-100 text-white/90 uppercase">MAKERS 3D</span>
            <span className="block font-black italic text-white relative -mt-1 md:-mt-6 uppercase">
              CREATIONS
              <span className="absolute -inset-1 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg] animate-shimmer pointer-events-none"></span>
            </span>
            <div className="flex items-center justify-center gap-3 mt-6 md:mt-8">
              <div className="h-[1px] w-6 sm:w-16 bg-white/20 hidden sm:block"></div>
              <span className="text-sm sm:text-xl md:text-2xl italic font-light tracking-normal text-white/60 lowercase">premium architectural masterpieces</span>
              <div className="h-[1px] w-6 sm:w-16 bg-white/20 hidden sm:block"></div>
            </div>
          </h1>

          {/* Subheading - More readable on mobile */}
          <p ref={subtitleRef} className="text-[10px] sm:text-lg lg:text-xl leading-relaxed text-white/40 max-w-[700px] mx-auto mb-8 md:mb-12 font-medium tracking-[0.3em] px-6 opacity-80 uppercase">
            Makers 3D — Premium 3D Creations. <br className="sm:hidden" /> Unparalleled industrial craftsmanship.
          </p>

          {/* CTA Buttons - Slick & Aesthetic Mobile Design */}
          <div ref={ctaRef} className="flex flex-col sm:flex-row-reverse gap-4 sm:gap-6 justify-center items-center px-6 mt-12 md:mt-16" suppressHydrationWarning>
            <Link
              href="/products"
              className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-4 text-xs sm:text-xs font-black tracking-[0.4em] uppercase rounded-full transition-all duration-500 overflow-hidden bg-white text-black hover:bg-gray-100 hover:scale-[1.02] active:scale-95 shadow-[0_20px_40px_rgba(255,255,255,0.15)]"
            >
              <span className="relative z-10">SHOP NOW</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-x-1 transition-transform">
                <path d="M5 12h14m-7-7l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>

            <Link
              href="/customorder"
              className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-4 text-xs sm:text-xs font-bold tracking-[0.4em] uppercase rounded-full transition-all duration-500 overflow-hidden bg-white/5 text-white border border-white/20 hover:bg-white/10 hover:border-white/40 hover:scale-[1.02] active:scale-95"
            >
              <span className="relative z-10">CUSTOM ORDER</span>
              <div className="w-2 h-2 rounded-full bg-white/40 animate-pulse"></div>
              {/* Glass background shimmer */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </Link>
          </div>
        </div>

        {/* Animated background elements */}
        <div
          className="absolute top-0 left-0 w-full h-full opacity-30"
          style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
          suppressHydrationWarning
        ></div>
        {/* Dynamic Floating Orbs */}
        <div className="hero-orb-1 absolute -top-20 -right-20 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-white/10 to-transparent blur-[100px] pointer-events-none select-none" suppressHydrationWarning></div>
        <div className="hero-orb-2 absolute -bottom-20 -left-20 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-white/[0.07] to-transparent blur-[120px] pointer-events-none select-none" suppressHydrationWarning></div>
      </div>

      {/* Categories & Featured Content Section */}
      <div className="bg-black pb-12 px-4 sm:px-8" suppressHydrationWarning>
        <div className="max-w-7xl mx-auto flex flex-col gap-12" suppressHydrationWarning>

          {/* Quick Categories - Pinterest Style (Visual & Productive) */}
          <div className="flex flex-col gap-6 " suppressHydrationWarning>
            <div className="flex justify-between items-center px-1" suppressHydrationWarning>
              <h2 className="text-[10px] sm:text-xs font-bold tracking-[0.3em] text-white/40 uppercase">Featured Categories</h2>
              <Link href="/products" className="text-[10px] sm:text-xs font-bold tracking-[0.1em] text-white/60 uppercase border-b border-white/20 pb-0.5 transition-colors hover:text-white hover:border-white">View All</Link>
            </div>

            <div
              className="flex pt-6 md:pt-10 overflow-x-auto no-scrollbar gap-6 sm:gap-10 pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 md:justify-center scroll-smooth"
              style={{ WebkitOverflowScrolling: 'touch' }}
              suppressHydrationWarning
            >
              {categories.map((cat, index) => {
                const isLast = index === categories.length - 1;
                return (
                  <button
                    key={cat}
                    onClick={() => handleCategoryClick(cat)}
                    className={`flex-shrink-0 flex flex-col items-center gap-4 transition-all active:scale-95 group/cat ${isLast ? 'pr-4 sm:pr-0' : ''}`}
                  >
                    <div className={`w-[72px] h-[72px] sm:w-[85px] sm:h-[85px] rounded-full flex items-center justify-center transition-all duration-500 overflow-hidden relative ${activeCategory === cat
                      ? 'bg-white border-[4px] border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.15)]'
                      : 'bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10'
                      }`} suppressHydrationWarning>
                      <span className={`text-[10px] sm:text-[11px] font-black tracking-tighter z-10 transition-colors duration-300 ${activeCategory === cat ? 'text-black' : 'text-white/80'}`}>
                        {cat === 'ALL' ? 'SHOP' : cat.substring(0, 4)}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover/cat:opacity-100 transition-opacity"></div>
                    </div>
                    <span className={`text-[9px] sm:text-[10px] font-bold tracking-[0.15em] uppercase transition-colors duration-300 ${activeCategory === cat ? 'text-white' : 'text-white/30 group-hover/cat:text-white/60'
                      }`}>
                      {cat.split(' ')[0]}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* New Arrivals - Horizontal Scroll */}
          <div className="flex flex-col gap-6" suppressHydrationWarning>
            <div className="flex justify-between items-center px-1" suppressHydrationWarning>
              <h2 className="text-[10px] sm:text-xs font-bold tracking-[0.3em] text-white/40 uppercase">New Arrivals</h2>
              <div className="flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-white/40"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-white/10"></div>
              </div>
            </div>

            <div
              className="flex overflow-x-auto no-scrollbar gap-4 sm:gap-6 -mx-4 px-4 sm:mx-0 sm:px-0 pb-20 sm:pb-8 scroll-smooth"
              style={{
                WebkitOverflowScrolling: 'touch',
                scrollPaddingRight: '24px'
              }}
              suppressHydrationWarning
            >
              {isLoadingProducts ? (
                [1, 2, 3, 4].map(i => (
                  <div key={i} className="min-w-[240px] sm:min-w-[280px] aspect-[3/4] bg-white/5 rounded-2xl animate-pulse" />
                ))
              ) : products.slice(0, 5).map((product, index, arr) => {
                const imageData = product.images?.[0] || product.image;
                const imageUrl = typeof imageData === 'object' ? imageData?.url : imageData;
                const imageAlt = typeof imageData === 'object' ? imageData?.alt : product.name || product.title;

                // Extract second image for hover effect
                const secondImageData = product.images?.[1];
                const secondImageUrl = secondImageData ? (typeof secondImageData === 'object' ? secondImageData?.url : secondImageData) : undefined;
                const secondImageAlt = secondImageData && typeof secondImageData === 'object' ? secondImageData?.alt : `${product.name || product.title} - view 2`;

                const isLast = index === arr.length - 1;

                return (
                  <div
                    key={`new-${product.id || product._id}`}
                    className="w-[240px] sm:w-[280px] flex-shrink-0"
                  >
                    <ProductCard
                      id={product.id || product._id}
                      image={imageUrl}
                      alt={imageAlt}
                      secondImage={secondImageUrl}
                      secondAlt={secondImageAlt}
                      title={product.name || product.title}
                      price={product.price}
                      originalPrice={product.originalPrice}
                      fixedMobileHeight={true}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <section className="bg-black px-4 sm:px-8 py-12 md:py-32" suppressHydrationWarning>
        <div className="max-w-7xl mx-auto" suppressHydrationWarning>
          {/* Section Header */}
          <div className="flex flex-col gap-2 mb-12 px-1">
            <h3 className="text-2xl sm:text-4xl font-thin tracking-tighter text-white uppercase">
              {activeCategory === 'ALL' ? 'Collection' : activeCategory}
              <span className="text-white/30 ml-4 font-light text-sm sm:text-lg tracking-widest">[{filteredProducts.length}]</span>
            </h3>
            <div className="w-16 h-[1px] bg-white/20"></div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-2.5 gap-y-6 sm:gap-6 children-appear" suppressHydrationWarning>
            {isLoadingProducts ? (
              [1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="aspect-[3/4] bg-white/5 animate-pulse rounded-2xl" suppressHydrationWarning />
              ))
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((product) => {
                const imageData = product.images?.[0] || product.image;
                const imageUrl = typeof imageData === 'object' ? imageData?.url : imageData;
                const imageAlt = typeof imageData === 'object' ? imageData?.alt : product.name || product.title;

                // Extract second image for hover effect
                const secondImageData = product.images?.[1];
                const secondImageUrl = secondImageData ? (typeof secondImageData === 'object' ? secondImageData?.url : secondImageData) : undefined;
                const secondImageAlt = secondImageData && typeof secondImageData === 'object' ? secondImageData?.alt : `${product.name || product.title} - view 2`;

                return (
                  <ProductCard
                    key={product.id || product._id}
                    id={product.id || product._id}
                    image={imageUrl}
                    alt={imageAlt}
                    secondImage={secondImageUrl}
                    secondAlt={secondImageAlt}
                    title={product.name || product.title}
                    price={product.price}
                    originalPrice={product.originalPrice}
                  />
                );
              })
            ) : (
              <div className="col-span-full text-center py-20 text-white/10 font-thin tracking-[0.3em] uppercase text-[10px]">
                No masterpieces in this drawer
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <ExperienceSection />

      {/* Footer */}
      <Footer />
    </>
  );
}
