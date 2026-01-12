'use client';

import React from 'react';

import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import Footer from './components/Footer';
import ExperienceSection from './components/ExperienceSection';
import ShivaHero from './components/ShivaHero';
import CategoryShowcase from './components/CategoryShowcase';
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

    // Tiny delay to ensure DOM is ready and handle potential early jumps
    const scrollReset = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as any });
    }, 50);

    // Secondary reset after longer delay safely covers components mounting after animations
    const lateScrollReset = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as any });
    }, 1000);

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

  const categories = [
    { id: 'ALL', label: 'SHOP', image: '/categories/all.png' },
    { id: 'DIVINE', label: 'DIVINE', image: '/categories/divine.png' },
    { id: 'AURA', label: 'AURA', image: '/categories/aura.png' },
    { id: 'MOTION', label: 'MOTION', image: '/categories/motion.png' },
    { id: 'BOX', label: 'BOX', image: '/categories/box.png' },
    { id: 'CUSTOM', label: 'CUSTOM', image: '/categories/custom.png' },
  ];

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
          // Force scroll to top again when products load (prevents jumps from late rendering)
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' as any });
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

      <ShivaHero />

      {/* Cinematic Brand Ticker - Engaging Layer */}
      <div className="bg-black py-10 border-y border-white/[0.05] overflow-hidden whitespace-nowrap flex select-none" suppressHydrationWarning>
        <div className="flex animate-[marquee_30s_linear_infinite] gap-12 sm:gap-24 items-center pr-12 sm:pr-24" suppressHydrationWarning>
          {[1, 2, 3, 4].map((i) => (
            <React.Fragment key={i}>
              <span className="text-[10px] sm:text-xs text-white/40 tracking-[0.8em] uppercase font-thin">Ethereal Aesthetics</span>
              <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
              <span className="text-[10px] sm:text-xs text-white tracking-[0.8em] uppercase font-black italic">The Divine Collection</span>
              <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
              <span className="text-[10px] sm:text-xs text-white/40 tracking-[0.8em] uppercase font-thin">Crafted in Geometry</span>
              <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
              <span className="text-[10px] sm:text-xs text-white tracking-[0.8em] uppercase font-black italic">Makers 3D Elite</span>
              <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
            </React.Fragment>
          ))}
        </div>
        <div className="flex animate-[marquee_30s_linear_infinite] gap-12 sm:gap-24 items-center pr-12 sm:pr-24" aria-hidden="true" suppressHydrationWarning>
          {[1, 2, 3, 4].map((i) => (
            <React.Fragment key={i}>
              <span className="text-[10px] sm:text-xs text-white/40 tracking-[0.8em] uppercase font-thin">Ethereal Aesthetics</span>
              <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
              <span className="text-[10px] sm:text-xs text-white tracking-[0.8em] uppercase font-black italic">The Divine Collection</span>
              <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
              <span className="text-[10px] sm:text-xs text-white/40 tracking-[0.8em] uppercase font-thin">Crafted in Geometry</span>
              <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
              <span className="text-[10px] sm:text-xs text-white tracking-[0.8em] uppercase font-black italic">Makers 3D Elite</span>
              <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="bg-black py-10 lg:py-24 px-6 sm:px-8 border-b border-white/[0.02]" suppressHydrationWarning>
        <div
          className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 sm:gap-20"
          suppressHydrationWarning
        >
          {[
            { title: 'PRECISION', desc: 'Every micron crafted with mathematical perfection.', icon: '01' },
            { title: 'AESTHETIC', desc: 'Ethereal designs that transcend architectural limits.', icon: '02' },
            { title: 'VISION', desc: 'Future-proof concepts for the modern collector.', icon: '03' }
          ].map((feature, i) => (
            <div key={i} className="group relative flex flex-col items-center text-center" suppressHydrationWarning>
              <div className="flex flex-col items-center gap-3 lg:gap-4 mb-3 lg:mb-6" suppressHydrationWarning>
                <span className="text-white/10 text-[7px] sm:text-xs font-mono group-hover:text-white/40 transition-colors" suppressHydrationWarning>[{feature.icon}]</span>
                <h4 className="text-white text-[9px] sm:text-2xl font-thin tracking-[0.4em] uppercase transition-all duration-700 group-hover:tracking-[0.6em]" suppressHydrationWarning>
                  {feature.title}
                </h4>
              </div>
              <p className="text-white/20 text-[7px] sm:text-xs tracking-[0.2em] uppercase leading-relaxed font-light max-w-[240px] md:max-w-[320px]" suppressHydrationWarning>
                {feature.desc}
              </p>
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-white/10 group-hover:w-full transition-all duration-1000" suppressHydrationWarning></div>
            </div>
          ))}
        </div>
      </div>

      {/* Dynamic Category Showcase */}
      {!isLoadingProducts && products.length > 0 && (
        <CategoryShowcase products={products} />
      )}

      {/* Products Section */}
      <section className="bg-black px-4 sm:px-8 pt-8 pb-20 md:py-32" suppressHydrationWarning>
        <div className="max-w-7xl mx-auto" suppressHydrationWarning>
          {/* Section Header */}
          <div className="flex flex-col gap-2 mb-12 px-1" suppressHydrationWarning>
            <h3 className="text-xl sm:text-4xl font-thin tracking-tighter text-white uppercase" suppressHydrationWarning>
              {activeCategory === 'ALL' ? 'New Arrival' : activeCategory}
              <span className="text-white/30 ml-4 font-light text-xs sm:text-lg tracking-widest" suppressHydrationWarning>[{filteredProducts.length}]</span>
            </h3>
            <div className="w-16 h-[1px] bg-white/20" suppressHydrationWarning></div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-2.5 gap-y-6 sm:gap-6 children-appear" suppressHydrationWarning>
            {isLoadingProducts ? (
              [1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-[3/4] bg-white/5 animate-pulse rounded-2xl" suppressHydrationWarning />
              ))
            ) : filteredProducts.length > 0 ? (
              filteredProducts.slice(0, 4).map((product) => {
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

          {/* View All Button */}
          {!isLoadingProducts && products.length > 0 && (
            <div className="mt-16 flex justify-center" suppressHydrationWarning>
              <Link
                href="/products"
                className="group relative px-10 py-4 bg-white/5 border border-white/10 text-white text-[10px] font-bold tracking-[0.4em] uppercase rounded-full overflow-hidden transition-all hover:bg-white hover:text-black hover:scale-105"
                suppressHydrationWarning
              >
                <span className="relative z-10" suppressHydrationWarning>View All Masterpieces</span>
                <div className="absolute inset-0 bg-white scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" suppressHydrationWarning />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Experience Section */}
      <ExperienceSection />

      {/* Footer */}
      <Footer />
    </>
  );
}
