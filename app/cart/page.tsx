'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Use same product images for consistency
const MOCK_CART_ITEMS = [
  {
    id: 1,
    image: '/images/product-1.jpg',
    title: 'Geometric Cube Lamp',
    price: 2000,
    category: 'LAMP',
    quantity: 1
  },
  {
    id: 5,
    image: '/images/product-5.jpg',
    title: 'Shiva Meditation Statue',
    price: 2000,
    category: 'MODELS',
    quantity: 1
  }
];

export default function CartPage() {
  const [items, setItems] = useState(MOCK_CART_ITEMS);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const checkoutBtnRef = useRef<HTMLButtonElement>(null);
  const filterRef = useRef<SVGFETurbulenceElement>(null);

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = subtotal > 0 ? 0 : 0; // Free delivery as per footer
  const total = subtotal + shipping;

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance Animations
      gsap.fromTo(".cart-title",
        { opacity: 0, y: 30, filter: 'blur(10px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1, ease: 'power3.out' }
      );

      gsap.fromTo(".cart-item",
        { opacity: 0, x: -30, filter: 'blur(5px)' },
        { opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.8, stagger: 0.1, ease: 'power3.out', delay: 0.3 }
      );

      gsap.fromTo(summaryRef.current,
        { opacity: 0, x: 30, filter: 'blur(5px)' },
        { opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.8, ease: 'power3.out', delay: 0.5 }
      );

      // Liquify Animation for Checkout Button
      if (checkoutBtnRef.current && filterRef.current) {
        const tl = gsap.timeline({ paused: true });
        tl.to(filterRef.current, {
          attr: { baseFrequency: '0.05 0.05' },
          duration: 0.5,
          ease: "none",
          repeat: -1,
          yoyo: true
        });

        checkoutBtnRef.current.addEventListener('mouseenter', () => {
          gsap.to(checkoutBtnRef.current, { scale: 1.02, duration: 0.3 });
          tl.play();
        });

        checkoutBtnRef.current.addEventListener('mouseleave', () => {
          gsap.to(checkoutBtnRef.current, { scale: 1, duration: 0.3 });
          tl.pause();
          gsap.to(filterRef.current, { attr: { baseFrequency: '0.00001 0.00001' }, duration: 0.3 });
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const updateQuantity = (id: number, delta: number) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeItem = (id: number) => {
    gsap.to(`.item-${id}`, {
      opacity: 0,
      x: 50,
      filter: 'blur(10px)',
      duration: 0.4,
      onComplete: () => {
        setItems(prev => prev.filter(item => item.id !== id));
      }
    });
  };

  return (
    <div className="bg-black min-h-screen text-white font-['Helvetica_Neue',Arial,sans-serif]" ref={containerRef}>
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        <h1 className="cart-title text-4xl md:text-6xl font-thin mb-16 tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
          Your Collection
        </h1>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Cart Items List */}
            <div className="lg:col-span-8 space-y-8" ref={itemsRef}>
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`cart-item item-${item.id} flex flex-col sm:flex-row gap-8 pb-8 border-b border-white/10 group`}
                >
                  <Link href={`/products/${item.id}`} className="relative w-full sm:w-40 aspect-[3/4] bg-neutral-900 overflow-hidden block">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 border border-white/5" />
                  </Link>

                  <div className="flex-1 flex flex-col justify-between py-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-2 block">{item.category}</span>
                        <h2 className="text-xl font-thin tracking-wide mb-1 hover:text-white/80 transition-colors">
                          <Link href={`/products/${item.id}`}>{item.title}</Link>
                        </h2>
                        <p className="text-white/60 font-light text-sm">₹{item.price.toLocaleString('en-IN')}</p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-white/20 hover:text-white transition-colors p-2"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" />
                        </svg>
                      </button>
                    </div>

                    <div className="flex items-center gap-6 mt-6">
                      <div className="flex items-center border border-white/10 bg-white/5">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-10 h-10 flex items-center justify-center hover:bg-white/10 transition-colors text-white/60"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-xs font-bold tracking-widest">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-10 h-10 flex items-center justify-center hover:bg-white/10 transition-colors text-white/60"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-white font-light">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4" ref={summaryRef}>
              <div className="bg-neutral-900/40 p-10 border border-white/5 sticky top-32">
                <h3 className="text-xs uppercase tracking-[0.4em] text-white/40 mb-8 pb-4 border-b border-white/5">Summary</h3>

                <div className="space-y-6 mb-10">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60 font-thin">Subtotal</span>
                    <span className="font-light">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60 font-thin">Shipping</span>
                    <span className="text-white/40 font-thin uppercase tracking-widest text-[10px]">Calculated at Next Step</span>
                  </div>
                  <div className="h-[1px] bg-white/5 w-full my-4" />
                  <div className="flex justify-between items-end">
                    <span className="text-xs uppercase tracking-[0.3em] font-normal">Estimated Total</span>
                    <span className="text-2xl font-light">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <button
                    ref={checkoutBtnRef}
                    className="checkout-btn w-full border border-white/20 text-white py-5 text-xs font-bold uppercase tracking-[0.3em] relative overflow-hidden transition-all duration-300"
                  >
                    <span className="relative z-10 transition-colors duration-300">Secure Checkout</span>
                    <div className="liquid-bg absolute inset-[-10px] bg-white translate-y-full transition-transform duration-500 ease-out z-0" />
                  </button>
                  <p className="text-[10px] text-center text-white/30 tracking-widest leading-relaxed">
                    SECURE PAYMENT POWERED BY RAZORPAY
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-40 text-center animate-fadeIn">
            <h2 className="text-2xl font-thin text-white/40 mb-8 tracking-[0.2em] uppercase">Your cart is currentyly empty</h2>
            <Link href="/" className="inline-block border border-white/20 px-12 py-5 text-[10px] uppercase font-bold tracking-[0.3em] hover:bg-white hover:text-black transition-all">
              Start Exploring
            </Link>
          </div>
        )}
      </main>

      {/* SVG Filter for Liquify Effect */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }} aria-hidden="true" focusable="false">
        <defs>
          <filter id="liquify-checkout" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              ref={filterRef}
              type="fractalNoise"
              baseFrequency="0.00001 0.00001"
              numOctaves="2"
              result="warp"
            />
            <feDisplacementMap in="SourceGraphic" in2="warp" scale="25" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      <Footer />

      <style jsx>{`
        .checkout-btn {
          isolation: isolate;
          overflow: hidden;
        }
        .checkout-btn:hover {
          color: black;
        }
        .liquid-bg {
          filter: url(#liquify-checkout);
          pointer-events: none;
          z-index: 1;
          background-color: white !important;
        }
        .checkout-btn:hover .liquid-bg {
          transform: translateY(0);
        }
        .checkout-btn span {
          z-index: 2;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 1s ease forwards;
        }
      `}</style>
    </div>
  );
}
