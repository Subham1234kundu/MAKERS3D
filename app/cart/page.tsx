'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';
import EnterpriseNav from '../components/enterprise/EnterpriseNav';
import EnterpriseFooter from '../components/enterprise/EnterpriseFooter';

// Use same product images for consistency
import { useCart } from '../providers/CartProvider';

export default function CartPage() {
  const { cartItems: items, updateQuantity, removeFromCart, cartSubtotal: subtotal, cartTotal: total, discount, applyCoupon, activeCoupon } = useCart();
  const summaryRef = useRef<HTMLDivElement>(null);
  const checkoutBtnRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);

  const [couponCode, setCouponCode] = useState('');
  const [couponMessage, setCouponMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;

    setIsApplying(true);
    setCouponMessage(null);

    // Simulate API delay for "estimating" feel
    await new Promise(resolve => setTimeout(resolve, 800));

    applyCoupon(couponCode);

    const upperCode = couponCode.toUpperCase();
    if (upperCode === 'MAKERS10' || upperCode === 'MAHADEV') {
      setCouponMessage({ type: 'success', text: `Coupon ${upperCode} applied successfully!` });
    } else {
      setCouponMessage({ type: 'error', text: 'Invalid coupon code' });
    }
    setIsApplying(false);
  };

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

      // Checkout Button scale effect
      if (checkoutBtnRef.current) {
        checkoutBtnRef.current.addEventListener('mouseenter', () => {
          gsap.to(checkoutBtnRef.current, { scale: 1.02, duration: 0.3 });
        });

        checkoutBtnRef.current.addEventListener('mouseleave', () => {
          gsap.to(checkoutBtnRef.current, { scale: 1, duration: 0.3 });
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleRemove = (id: number | string) => {
    gsap.to(`.item-${id}`, {
      opacity: 0,
      x: 50,
      filter: 'blur(10px)',
      duration: 0.4,
      onComplete: () => {
        removeFromCart(id);
      }
    });
  };

  return (
    <div className="bg-white min-h-screen text-black font-['Helvetica_Neue',Arial,sans-serif]" ref={containerRef}>
      <EnterpriseNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 md:pt-32 pb-12 md:pb-20">
        <h1 className="cart-title text-3xl sm:text-4xl md:text-6xl font-thin mb-8 md:mb-16 tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-black to-black/60">
          Your Collection
        </h1>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16">
            {/* Cart Items List */}
            <div className="lg:col-span-8 space-y-6 sm:space-y-8" ref={itemsRef}>
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`cart-item item-${item.id} flex flex-col sm:flex-row gap-6 sm:gap-8 pb-6 sm:pb-8 border-b border-black/10 group`}
                >
                  <Link href={`/products/${item.id}`} className="relative w-full sm:w-40 aspect-[4/5] sm:aspect-[3/4] bg-neutral-100 overflow-hidden block">
                    <Image
                      src={typeof item.images?.[0] === 'string' ? item.images[0] : (item.images?.[0]?.url || item.image || '/images/placeholder.jpg')}
                      alt={typeof item.images?.[0] === 'object' ? item.images[0].alt : (item.name || item.title || 'Product')}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      unoptimized={true}
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 border border-black/5" />
                  </Link>

                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-black/40 mb-2 block">{item.category}</span>
                        <h2 className="text-lg sm:text-xl font-thin tracking-wide mb-1 hover:text-black/80 transition-colors">
                          <Link href={`/products/${item.id}`}>{item.name || item.title}</Link>
                        </h2>
                        <p className="text-black/60 font-light text-sm">₹{item.price.toLocaleString('en-IN')}</p>
                      </div>
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="text-black/20 hover:text-black transition-colors p-2"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" />
                        </svg>
                      </button>
                    </div>

                    <div className="flex items-center gap-6 mt-4 sm:mt-6">
                      <div className="flex items-center border border-black/10 bg-black/5">
                        <button
                          onClick={() => {
                            if (item.quantity <= 1) {
                              handleRemove(item.id);
                            } else {
                              updateQuantity(item.id, -1);
                            }
                          }}
                          className="w-10 h-10 flex items-center justify-center hover:bg-black/10 transition-colors text-black/60"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-[11px] font-bold tracking-widest">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-10 h-10 flex items-center justify-center hover:bg-black/10 transition-colors text-black/60"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-black font-light text-sm sm:text-base">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4" ref={summaryRef}>
              <div className="bg-neutral-100/40 p-6 sm:p-10 border border-black/5 sticky top-24 md:top-32">
                <h3 className="text-[10px] uppercase tracking-[0.4em] text-black/40 mb-6 sm:mb-8 pb-4 border-b border-black/5">Summary</h3>

                <div className="space-y-4 sm:space-y-6 mb-8 sm:mb-10">
                  <div className="flex justify-between text-sm">
                    <span className="text-black/60 font-thin">Subtotal</span>
                    <span className="font-light">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-[13px]">
                    <span className="text-black/60 font-thin">Shipping</span>
                    <span className="text-green-400 font-light text-sm">Free</span>
                  </div>

                  {/* Coupon Section */}
                  <div className="pt-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="COUPON CODE"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="w-full bg-black/5 border border-black/10 px-4 py-3 text-[11px] text-black tracking-widest placeholder:text-black/20 focus:outline-none focus:border-black/30 transition-colors uppercase"
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        className="bg-black/10 border border-black/10 px-4 py-3 text-[10px] text-black tracking-widest hover:bg-black hover:text-white transition-all uppercase disabled:opacity-50 disabled:cursor-not-allowed min-w-[80px] cursor-pointer relative z-10"
                        disabled={!couponCode.trim() || isApplying}
                      >
                        {isApplying ? '...' : 'Apply'}
                      </button>
                    </div>
                    {couponMessage && (
                      <p className={`text-[9px] mt-2 tracking-wide ${couponMessage.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                        {couponMessage.text}
                      </p>
                    )}
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-400">
                      <span className="font-thin tracking-wide">Discount</span>
                      <span className="font-light">-₹{discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="h-[1px] bg-black/5 w-full my-4" />
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] font-normal">Estimated Total</span>
                    <span className="text-xl sm:text-2xl font-light">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <Link
                    href="/checkout"
                    className="w-full border border-black/20 text-black py-4 sm:py-5 text-[11px] sm:text-xs font-bold uppercase tracking-[0.3em] relative overflow-hidden transition-all duration-300 hover:bg-black hover:text-white hover:border-black hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] flex items-center justify-center"
                  >
                    Secure Checkout
                  </Link>
                  <p className="text-[9px] sm:text-[10px] text-center text-black/30 tracking-widest leading-relaxed">
                    SECURE PAYMENT POWERED BY UPIGATEWAY
                  </p>
                </div>
              </div>
            </div>
          </div>

        ) : (
          <div className="py-40 text-center animate-fadeIn">
            <h2 className="text-2xl font-thin text-black/40 mb-8 tracking-[0.2em] uppercase">Your cart is currentyly empty</h2>
            <Link href="/" className="inline-block border border-black/20 px-12 py-5 text-[10px] uppercase font-bold tracking-[0.3em] hover:bg-black hover:text-white transition-all">
              Start Exploring
            </Link>
          </div>
        )
        }
      </main >



      <EnterpriseFooter />

      <style jsx>{`

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 1s ease forwards;
        }
      `}</style>
    </div >
  );
}
