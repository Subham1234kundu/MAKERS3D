'use client';

import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import Footer from './components/Footer';
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
        ScrollTrigger.create({
          trigger: 'body',
          start: 'bottom bottom',
          end: 'bottom-=300 bottom',
          scrub: true,
          onUpdate: (self) => {
            const footer = document.querySelector('footer');
            if (footer) {
              const b = self.progress * 10;
              footer.style.filter = b > 0.5 ? `blur(${b}px)` : 'none';
              footer.style.opacity = (1 - (self.progress * 0.15)).toString();
            }
          }
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

  const products = [
    {
      id: 1,
      image: '/images/product-1.jpg',
      title: 'Geometric Cube Lamp',
      price: 2000,
      originalPrice: 3000
    },
    {
      id: 2,
      image: '/images/product-2.jpg',
      title: 'LED Crystal Cube',
      price: 2000,
      originalPrice: 3000
    },
    {
      id: 3,
      image: '/images/product-3.jpg',
      title: 'Hexagonal Wall Art',
      price: 2000,
      originalPrice: 3000
    },
    {
      id: 4,
      image: '/images/product-4.jpg',
      title: 'Custom Map Frame',
      price: 2000,
      originalPrice: 3000
    },
    {
      id: 5,
      image: '/images/product-5.jpg',
      title: 'Shiva Meditation Statue',
      price: 2000,
      originalPrice: 3000
    },
    {
      id: 6,
      image: '/images/product-6.jpg',
      title: 'Shiva Silhouette Lamp',
      price: 2000,
      originalPrice: 3000
    },
    {
      id: 7,
      image: '/images/product-7.jpg',
      title: 'Pyramid Geometric Lamp',
      price: 2000,
      originalPrice: 3000
    },
    {
      id: 8,
      image: '/images/product-8.jpg',
      title: 'Moon Surface Lamp',
      price: 2000,
      originalPrice: 3000
    }
  ];

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <div ref={heroRef} className="relative min-h-[calc(100vh-76px)] bg-black flex items-center justify-center overflow-hidden px-8 py-8">
        <div className="relative z-10 text-center max-w-[1000px]">
          {/* Main Heading - Old School Classic Thin */}
          <h1 ref={titleRef} className="text-5xl md:text-7xl lg:text-8xl font-thin leading-none mb-8 tracking-tighter font-['Helvetica_Neue',Arial,sans-serif] bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
            Crafting the Future
            <br />
            <span className="italic font-light tracking-normal text-white/90">One Layer at a Time</span>
          </h1>

          {/* Subheading */}
          <p ref={subtitleRef} className="text-base md:text-lg lg:text-xl leading-snug text-white/50 max-w-[700px] mx-auto mb-12 font-thin tracking-wide">
            Precision-engineered pieces and bespoke creations. We transform your vision into reality with unparalleled craftsmanship and cutting-edge technology.
          </p>

          {/* CTA Buttons */}
          <div ref={ctaRef} className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/order"
              className="btn-shimmer relative inline-flex items-center gap-3 px-8 py-4 text-sm font-normal tracking-[0.08em] uppercase rounded-sm transition-all duration-300 overflow-hidden bg-gray-500/15 text-white border border-gray-400/30 hover:bg-gray-500/25 hover:border-gray-400/50 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(107,114,128,0.2)]"
            >
              <span>PLACE CUSTOM ORDER</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link
              href="/products"
              className="btn-shimmer relative inline-flex items-center gap-3 px-8 py-4 text-sm font-normal tracking-[0.08em] uppercase rounded-sm transition-all duration-300 overflow-hidden bg-white text-black border border-white hover:bg-gray-200 hover:border-gray-200 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(156,163,175,0.3)]"
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
            backgroundSize: '60px 60px'
          }}
        ></div>
        <div className="absolute -top-[300px] -right-[300px] w-[600px] h-[600px] rounded-full blur-[120px] opacity-[0.08] bg-gradient-to-br from-gray-500 to-gray-600 animate-glow"></div>
        <div className="absolute -bottom-[250px] -left-[250px] w-[500px] h-[500px] rounded-full blur-[120px] opacity-[0.08] bg-gradient-to-br from-gray-700 to-gray-800 animate-glow-delayed"></div>
      </div>


      {/* Products Section */}
      <section className="bg-black px-8 py-32">
        <div className="max-w-7xl mx-auto">
          {/* Category Filter */}
          <div className="flex flex-wrap items-center justify-center gap-8 mb-16">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className="relative pb-2 text-sm font-thin tracking-wider transition-colors duration-300"
                style={{
                  color: activeCategory === category ? '#ffffff' : 'rgba(255, 255, 255, 0.5)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
                onMouseLeave={(e) => {
                  if (activeCategory !== category) {
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.5)';
                  }
                }}
              >
                {category}
                {/* Animated Underline - Only shows when active */}
                <div
                  ref={(el) => { underlineRefs.current[category] = el; }}
                  className="absolute bottom-0 left-0 w-full h-[1px] bg-white origin-left"
                  style={{
                    transform: activeCategory === category ? 'scaleX(1)' : 'scaleX(0)',
                  }}
                />
              </button>
            ))}
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                image={product.image}
                title={product.title}
                price={product.price}
                originalPrice={product.originalPrice}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Responsive Styles for Mobile */}
      <style jsx>{`
        @media (max-width: 768px) {
          .btn-shimmer {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </>
  );
}
