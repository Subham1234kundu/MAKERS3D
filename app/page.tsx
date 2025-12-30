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
  const underlineRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
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

    // Animate underline from left to right
    const underline = underlineRefs.current[category];
    if (underline) {
      gsap.fromTo(
        underline,
        { scaleX: 0, transformOrigin: 'left' },
        { scaleX: 1, duration: 0.4, ease: 'power2.out' }
      );
    }
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
      <div ref={heroRef} className="relative min-h-[calc(100vh-70px)] bg-black flex items-center justify-center overflow-hidden px-4 sm:px-8 md:py-12 md:py-8 pb-2" suppressHydrationWarning>
        <div className="relative z-10 text-center max-w-[1000px] w-full" suppressHydrationWarning>
          {/* Main Heading - Old School Classic Thin */}
          <h1 ref={titleRef} className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-thin leading-[1.1] mb-6 md:mb-8 tracking-tighter font-['Helvetica_Neue',Arial,sans-serif] bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60 md:mt-20">
            Crafting the Future
            <br />
            <span className="italic font-light tracking-normal text-white/90">One Layer at a Time</span>
          </h1>

          {/* Subheading - More readable on mobile */}
          <p ref={subtitleRef} className="text-[13px] sm:text-lg lg:text-xl leading-relaxed text-white/50 max-w-[700px] mx-auto mb-10 md:mb-12 font-thin tracking-widest px-6 opacity-80 uppercase">
            Precision-engineered pieces. Unparalleled craftsmanship.
          </p>

          {/* CTA Buttons - Better mobile layout */}
          <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center items-center px-6" suppressHydrationWarning>
            <Link
              href="/customorder"
              className="btn-shimmer relative w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 text-[11px] sm:text-sm font-light tracking-[0.2em] uppercase rounded-full transition-all duration-300 overflow-hidden bg-white/10 text-white border border-white/20 hover:bg-white/20"
            >
              <span>CUSTOM ORDER</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 12h14m-7-7l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link
              href="/products"
              className="btn-shimmer relative w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 text-[11px] sm:text-sm font-medium tracking-[0.2em] uppercase rounded-full transition-all duration-300 overflow-hidden bg-white text-black border border-white hover:bg-gray-100"
            >
              <span>SHOP NOW</span>
            </Link>
          </div>
        </div>

        {/* Animated background elements */}
        <div
          className="absolute top-0 left-0 w-full h-full opacity-30"
          style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.01) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.01) 1px, transparent 1px)`,
            backgroundSize: '30px 30px'
          }}
          suppressHydrationWarning
        ></div>
        {/* Dynamic Floating Orbs */}
        <div className="hero-orb-1 absolute -top-20 -right-20 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-white/10 to-transparent blur-[100px] pointer-events-none select-none" suppressHydrationWarning></div>
        <div className="hero-orb-2 absolute -bottom-20 -left-20 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-white/[0.07] to-transparent blur-[120px] pointer-events-none select-none" suppressHydrationWarning></div>
      </div>

      {/* Mobile Only: Productive Tools section */}
      <div className="md:hidden bg-black pb-8 px-4" suppressHydrationWarning>
        <div className="flex flex-col gap-8">


          {/* Quick Categories - Pinterest Style (Visual & Productive) */}
          {/* <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center px-1">
              <h2 className="text-[10px] font-bold tracking-[0.3em] text-white/40 uppercase">Featured Categories</h2>
              <Link href="/products" className="text-[10px] font-bold tracking-[0.1em] text-white/60 uppercase border-b border-white/20 pb-0.5">View All</Link>
            </div>

            <div className="flex overflow-x-auto no-scrollbar gap-5 pb-2 -mx-4 px-4">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className="flex-shrink-0 flex flex-col items-center gap-3 transition-all active:scale-90"
                >
                  <div className={`w-[68px] h-[68px] rounded-full flex items-center justify-center transition-all duration-500 overflow-hidden relative group ${activeCategory === cat
                      ? 'bg-white border-[3px] border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                      : 'bg-white/5 border border-white/10'
                    }`}>
                    <span className={`text-[10px] font-black tracking-tighter z-10 ${activeCategory === cat ? 'text-black' : 'text-white/80'}`}>
                      {cat === 'ALL' ? 'SHOP' : cat.substring(0, 4)}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <span className={`text-[9px] font-bold tracking-[0.12em] uppercase transition-colors ${activeCategory === cat ? 'text-white' : 'text-white/30'
                    }`}>
                    {cat.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>
          </div> */}

          {/* New Arrivals - Horizontal Scroll (Productive for Mobile) */}
          <div className="flex flex-col gap-5 mt-4">
            <div className="flex justify-between items-center px-1">
              <h2 className="text-[10px] font-bold tracking-[0.3em] text-white/40 uppercase">New Arrivals</h2>
              <div className="flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-white/40"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-white/10"></div>
              </div>
            </div>

            <div className="flex overflow-x-auto no-scrollbar gap-4 -mx-4 px-4 pb-4">
              {isLoadingProducts ? (
                [1, 2, 3].map(i => (
                  <div key={i} className="min-w-[280px] aspect-[4/5] bg-white/5 rounded-3xl animate-pulse" />
                ))
              ) : products.slice(0, 4).map((product) => (
                <div key={`new-${product.id || product._id}`} className="min-w-[280px]">
                  <ProductCard
                    id={product.id || product._id}
                    image={product.images?.[0] || product.image}
                    title={product.name || product.title}
                    price={product.price}
                    originalPrice={product.originalPrice}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <section className="bg-black px-4 sm:px-8 py-12 md:py-32" suppressHydrationWarning>
        <div className="max-w-7xl mx-auto" suppressHydrationWarning>
          {/* Desktop Only Category Filter */}
          <div className="hidden md:flex flex-wrap items-center justify-center gap-8 mb-16" suppressHydrationWarning>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className="relative pb-2 text-sm font-thin tracking-widest transition-colors duration-300 whitespace-nowrap"
                style={{
                  color: activeCategory === category ? '#ffffff' : 'rgba(255, 255, 255, 0.4)'
                }}
                suppressHydrationWarning
              >
                {category}
                <div
                  ref={(el) => { underlineRefs.current[category] = el; }}
                  className="absolute bottom-0 left-0 w-full h-[1px] bg-white origin-left"
                  style={{
                    transform: activeCategory === category ? 'scaleX(1)' : 'scaleX(0)',
                  }}
                  suppressHydrationWarning
                />
              </button>
            ))}
          </div>

          {/* Section Header for Mobile Products */}
          <div className="md:hidden flex flex-col gap-2 mb-8 px-1">
            <h3 className="text-2xl font-thin tracking-tighter text-white">
              {activeCategory === 'ALL' ? 'Collection' : activeCategory}
              <span className="text-white/40 ml-2 font-light">[{filteredProducts.length}]</span>
            </h3>
            <div className="w-12 h-[1px] bg-white/20"></div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-8 sm:gap-8 children-appear" suppressHydrationWarning>
            {isLoadingProducts ? (
              [1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="aspect-[3/4] bg-white/5 animate-pulse rounded-2xl" suppressHydrationWarning />
              ))
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductCard
                  key={product.id || product._id}
                  id={product.id || product._id}
                  image={product.images?.[0] || product.image}
                  title={product.name || product.title}
                  price={product.price}
                  originalPrice={product.originalPrice}
                />
              ))
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
