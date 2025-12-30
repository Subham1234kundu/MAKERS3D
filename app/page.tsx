'use client';

import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import Footer from './components/Footer';
import Newsletter from './components/Newsletter';
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

        // 3. Footer Smooth Blur
        const footerElement = document.querySelector('footer');
        if (footerElement) {
          ScrollTrigger.create({
            trigger: document.body,
            start: 'bottom bottom',
            end: 'bottom-=300 bottom',
            scrub: true,
            onUpdate: (self) => {
              if (footerElement) {
                const b = self.progress * 10;
                footerElement.style.filter = b > 0.5 ? `blur(${b}px)` : 'none';
                footerElement.style.opacity = (1 - (self.progress * 0.15)).toString();
              }
            }
          });
        }
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

          {/* Subheading */}
          <p ref={subtitleRef} className="text-sm md:text-lg lg:text-xl leading-relaxed text-white/50 max-w-[700px] mx-auto mb-10 md:mb-12 font-thin tracking-wide px-4">
            Precision-engineered pieces and bespoke creations. We transform your vision into reality with unparalleled craftsmanship and cutting-edge technology.
          </p>

          {/* CTA Buttons */}
          <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4" suppressHydrationWarning>
            <Link
              href="/customorder"
              className="btn-shimmer relative w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 text-[10px] sm:text-sm font-normal tracking-[0.08em] uppercase rounded-sm transition-all duration-300 overflow-hidden bg-gray-500/15 text-white border border-gray-400/30 hover:bg-gray-500/25 hover:border-gray-400/50 hover:-translate-y-0.5"
            >
              <span>PLACE CUSTOM ORDER</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link
              href="/products"
              className="btn-shimmer relative w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 text-[10px] sm:text-sm font-normal tracking-[0.08em] uppercase rounded-sm transition-all duration-300 overflow-hidden bg-white text-black border border-white hover:bg-gray-200 hover:border-gray-200 hover:-translate-y-0.5"
            >
              <span>EXPLORE PRODUCTS</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Animated background elements */}
        <div
          className="absolute top-0 left-0 w-full h-full opacity-40"
          style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.015) 1px, transparent 1px)`,
            backgroundSize: '40px 40px sm:60px 60px'
          }}
          suppressHydrationWarning
        ></div>
        <div className="absolute -top-[150px] sm:-top-[300px] -right-[150px] sm:-right-[300px] w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] rounded-full blur-[80px] sm:blur-[120px] opacity-[0.08] bg-gradient-to-br from-gray-500 to-gray-600 animate-glow" suppressHydrationWarning></div>
        <div className="absolute -bottom-[125px] sm:-bottom-[250px] -left-[125px] sm:-left-[250px] w-[250px] sm:w-[500px] h-[250px] sm:h-[500px] rounded-full blur-[80px] sm:blur-[120px] opacity-[0.08] bg-gradient-to-br from-gray-700 to-gray-800 animate-glow-delayed" suppressHydrationWarning></div>
      </div>


      {/* Products Section */}
      <section className="bg-black px-4 sm:px-8 py-16 md:py-32" suppressHydrationWarning>
        <div className="max-w-7xl mx-auto" suppressHydrationWarning>
          {/* Category Filter */}
          <div className="flex overflow-x-auto no-scrollbar sm:flex-wrap items-center justify-start sm:justify-center gap-6 sm:gap-8 mb-12 md:mb-16 pb-4 sm:pb-0" suppressHydrationWarning>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className="relative pb-2 text-[11px] sm:text-sm font-thin tracking-wider transition-colors duration-300 whitespace-nowrap"
                style={{
                  color: activeCategory === category ? '#ffffff' : 'rgba(255, 255, 255, 0.5)'
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

          {/* Product Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 children-appear" suppressHydrationWarning>
            {isLoadingProducts ? (
              [1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square bg-white/5 animate-pulse rounded-sm" suppressHydrationWarning />
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
              <div className="col-span-full text-center py-20 text-white/20 font-thin tracking-widest uppercase">
                No products found
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <Newsletter />

      {/* Footer */}
      <Footer />
    </>
  );
}
