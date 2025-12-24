'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const products = [
    {
        id: 1,
        image: '/images/product-1.jpg',
        title: 'Geometric Cube Lamp',
        price: 2000,
        originalPrice: 3000,
        description: 'A masterpiece of modern design, this Geometric Cube Lamp blends architectural precision with soft, ambient lighting. Perfect for any minimalist space, it features a unique interlocking structure that casts mesmerizing shadows.',
        category: 'LAMP',
        specs: ['3D Printed with High-Resolution Polymers', 'Warm LED 3000K included', 'Dimensions: 15cm x 15cm x 15cm', 'Custom USB-C powered base']
    },
    {
        id: 2,
        image: '/images/product-2.jpg',
        title: 'LED Crystal Cube',
        price: 2000,
        originalPrice: 3000,
        description: 'Experience the magic of light refracted through crystal-clear 3D geometry. This LED Crystal Cube uses advanced internal diffusion technology to create a stunning holographic effect that appears to float in mid-air.',
        category: 'LAMP',
        specs: ['Optically transparent resin', 'RGB Multi-color modes', 'Touch-sensitive brightness control', 'Solid walnut wood base']
    },
    {
        id: 3,
        image: '/images/product-3.jpg',
        title: 'Hexagonal Wall Art',
        price: 2000,
        originalPrice: 3000,
        description: 'Transform your walls into an interactive gallery with our modular Hexagonal Wall Art. Each piece is precision-crafted to fit perfectly with others, allowing you to create endless geometric patterns tailored to your space.',
        category: 'HOME DECORS',
        specs: ['Lightweight matte finish compound', 'Magnetic mounting system', 'Available in Obsidian and Arctic White', 'Dimensions: 20cm per unit']
    },
    {
        id: 4,
        image: '/images/product-4.jpg',
        title: 'Custom Map Frame',
        price: 2000,
        originalPrice: 3000,
        description: 'Your favorite city, immortalized in 3D. Our Custom Map Frame uses high-precision topographical data to recreate streets, rivers, and buildings in stunning depth. A truly personal statement piece for your home or office.',
        category: 'FRAMES',
        specs: ['Real topographic 3D terrain', 'Museum-grade black wood frame', 'Glass protection with anti-reflective coating', 'Custom location engraving']
    },
    {
        id: 5,
        image: '/images/product-5.jpg',
        title: 'Shiva Meditation Statue',
        price: 2000,
        originalPrice: 3000,
        description: 'Invoke peace and tranquility with the Shiva Meditation Statue. This contemporary interpretation captures the essence of deep dhyana through smooth, flowing geometries and a timeless matte aesthetic.',
        category: 'MODELS',
        specs: ['Reinforced architectural plaster finish', 'Symbolic geometric precision', 'Weight: 1.2kg for stable placement', 'Height: 25cm']
    },
    {
        id: 6,
        image: '/images/product-6.jpg',
        title: 'Shiva Silhouette Lamp',
        price: 2000,
        originalPrice: 3000,
        description: 'A divine interplay of light and shadow. The Shiva Silhouette Lamp project the powerful form of Adiyogi onto your walls, creating a sacred and serene atmosphere every time you switch it on.',
        category: 'LAMP',
        specs: ['Precision laser-cut silhouette', 'Back-lit LED glow technology', 'Wall-toggle switch included', 'Material: Eco-friendly resin']
    },
    {
        id: 7,
        image: '/images/product-7.jpg',
        title: 'Pyramid Geometric Lamp',
        price: 2000,
        originalPrice: 3000,
        description: 'Drawing inspiration from ancient monuments and futuristic sci-fi, the Pyramid Geometric Lamp is a bold sculptural piece that radiates light from its core, symbolizing eternal energy and balance.',
        category: 'LAMP',
        specs: ['Fractal 3D printed architecture', 'Smart home compatible Bulb included', 'Height: 30cm', 'Finish: Metallic Bronze / Stealth Black']
    },
    {
        id: 8,
        image: '/images/product-8.jpg',
        title: 'Moon Surface Lamp',
        price: 2000,
        originalPrice: 3000,
        description: 'Bring the moon to your room. This lamp uses NASA-grade lunar data to replicate every crater and mountain on the moon\'s surface. It doesn\'t just glow; it captures the very soul of the night sky.',
        category: 'LAMP',
        specs: ['Lithophane-based 3D print', 'Dimmable warm to cool light transition', 'Rechargeable battery (8 hours life)', 'Wooden stand included']
    }
];

export default function ProductDetailPage() {
    const { id } = useParams();
    const product = products.find(p => p.id === Number(id)) || products[0];
    const [activeTab, setActiveTab] = useState('description');

    const containerRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const buyBtnRef = useRef<HTMLButtonElement>(null);
    const filterRef = useRef<SVGFETurbulenceElement>(null);

    useEffect(() => {
        window.scrollTo(0, 0);

        const ctx = gsap.context(() => {
            gsap.fromTo(imageRef.current,
                { opacity: 0, x: -50, filter: 'blur(10px)' },
                { opacity: 1, x: 0, filter: 'blur(0px)', duration: 1, ease: 'power3.out' }
            );

            gsap.fromTo(contentRef.current?.children || [],
                { opacity: 0, x: 50, filter: 'blur(10px)' },
                { opacity: 1, x: 0, filter: 'blur(0px)', duration: 1, stagger: 0.1, ease: 'power3.out', delay: 0.2 }
            );

            // Liquify Animation Logic (Fully GSAP Managed & Cleaned Up)
            if (buyBtnRef.current && filterRef.current) {
                const btn = buyBtnRef.current;
                const liquidBg = btn.querySelector('.liquid-bg');
                const filter = filterRef.current;

                // Set initial state
                gsap.set(liquidBg, { y: '100%' });

                const rippleTl = gsap.timeline({ paused: true, repeat: -1, yoyo: true });
                rippleTl.to(filter, {
                    attr: { baseFrequency: '0.06 0.06' },
                    duration: 0.5,
                    ease: "none"
                });

                const onEnter = () => {
                    gsap.to(btn, { scale: 1.02, duration: 0.3, overwrite: true });
                    gsap.to(liquidBg, { y: '0%', duration: 0.4, ease: 'power2.out', overwrite: true });
                    rippleTl.play();
                };

                const onLeave = () => {
                    gsap.to(btn, { scale: 1, duration: 0.3, overwrite: true });
                    gsap.to(liquidBg, { y: '100%', duration: 0.4, ease: 'power2.in', overwrite: true });
                    rippleTl.pause();
                    gsap.to(filter, { attr: { baseFrequency: '0.00001 0.00001' }, duration: 0.3, overwrite: true });
                };

                const onDown = () => {
                    gsap.to(btn, { scale: 0.98, duration: 0.1, overwrite: true });
                    gsap.to(filter, { attr: { baseFrequency: '0.15 0.15' }, duration: 0.1, overwrite: true });
                };

                const onUp = () => {
                    gsap.to(btn, { scale: 1.05, duration: 0.4, ease: 'elastic.out(1, 0.3)', overwrite: true });
                    gsap.to(filter, { attr: { baseFrequency: '0.06 0.06' }, duration: 0.4, overwrite: true });

                    const surge = gsap.timeline();
                    surge.to(liquidBg, { filter: 'brightness(2)', duration: 0.1 })
                        .to(liquidBg, { filter: 'brightness(1)', duration: 0.3 });
                };

                btn.addEventListener('mouseenter', onEnter);
                btn.addEventListener('mouseleave', onLeave);
                btn.addEventListener('mousedown', onDown);
                btn.addEventListener('mouseup', onUp);

                return () => {
                    btn.removeEventListener('mouseenter', onEnter);
                    btn.removeEventListener('mouseleave', onLeave);
                    btn.removeEventListener('mousedown', onDown);
                    btn.removeEventListener('mouseup', onUp);
                };
            }
        }, containerRef);

        return () => ctx.revert();
    }, [id]);

    return (
        <div className="bg-black min-h-screen text-white font-['Helvetica_Neue',Arial,sans-serif]" ref={containerRef}>
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 pt-32 pb-20">
                {/* Breadcrumbs */}
                <nav className="mb-12 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/40">
                    <Link href="/" className="hover:text-white transition-colors">Home</Link>
                    <span>/</span>
                    <Link href="/" className="hover:text-white transition-colors">Products</Link>
                    <span>/</span>
                    <span className="text-white/80">{product.title}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
                    {/* Product Image Section */}
                    <div ref={imageRef} className="relative aspect-[4/5] bg-neutral-900 group">
                        <Image
                            src={product.image}
                            alt={product.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            priority
                        />
                        <div className="absolute inset-0 border border-white/10 pointer-events-none" />
                    </div>

                    {/* Product Info Section */}
                    <div ref={contentRef} className="flex flex-col">
                        <span className="text-xs font-light uppercase tracking-[0.4em] text-white/40 mb-4">{product.category}</span>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-thin leading-tight mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                            {product.title}
                        </h1>

                        <div className="flex items-center gap-4 mb-8">
                            <span className="text-3xl font-light">₹{product.price.toLocaleString('en-IN')}</span>
                            <span className="text-xl text-white/30 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                            <span className="bg-white/10 px-2 py-1 text-[10px] tracking-widest uppercase border border-white/10">33% OFF</span>
                        </div>

                        <p className="text-white/60 font-thin leading-relaxed tracking-wide mb-10 text-lg">
                            {product.description}
                        </p>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-16 px-1">
                            <Link href="/cart" className="flex-1">
                                <button className="w-full bg-white text-black py-5 text-xs font-bold uppercase tracking-[0.2em] hover:bg-neutral-200 transition-all duration-300">
                                    Add to Cart
                                </button>
                            </Link>
                            <button
                                ref={buyBtnRef}
                                className="buy-now-btn group flex-1 border border-white/20 text-white py-5 text-xs font-bold uppercase tracking-[0.2em] relative overflow-hidden transition-all duration-300"
                            >
                                {/* Background Liquify Layer - Fully GSAP Managed */}
                                <div className="liquid-bg absolute inset-[-10px] bg-white translate-y-full" />

                                {/* Text Layer - Stays sharp */}
                                <span className="relative z-10 transition-colors duration-300 group-hover:text-black">
                                    Buy Now
                                </span>
                            </button>
                        </div>

                        {/* Tabs Section */}
                        <div className="border-t border-white/10 pt-10">
                            <div className="flex gap-8 mb-8 border-b border-white/5 pb-4">
                                {['description', 'specifications', 'shipping'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`text-[10px] uppercase tracking-[0.3em] transition-all relative pb-4 ${activeTab === tab ? 'text-white' : 'text-white/30 hover:text-white/60'
                                            }`}
                                    >
                                        {tab}
                                        {activeTab === tab && (
                                            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white animate-expand" />
                                        )}
                                    </button>
                                ))}
                            </div>

                            <div className="min-h-[150px]">
                                {activeTab === 'description' && (
                                    <div className="text-white/50 font-thin text-sm leading-relaxed space-y-4 animate-fadeIn">
                                        <p>Designed for those who appreciate the finer details in geometry and craftsmanship. This piece serves as a bridge between technology and art.</p>
                                        <p>Every layer is printed with extreme precision using sustainable materials, ensuring a finish that is both durable and aesthetically sublime.</p>
                                    </div>
                                )}
                                {activeTab === 'specifications' && (
                                    <ul className="space-y-3 animate-fadeIn">
                                        {product.specs.map((spec, i) => (
                                            <li key={i} className="flex items-center gap-3 text-white/50 font-thin text-sm">
                                                <div className="w-1 h-1 bg-white/40 rounded-full" />
                                                {spec}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                {activeTab === 'shipping' && (
                                    <div className="text-white/50 font-thin text-sm leading-relaxed animate-fadeIn">
                                        <p>All items are custom-printed upon order. Please allow 3-5 business days for production.</p>
                                        <p className="mt-4">Shipping is nationwide across India. Standard delivery takes 5-7 business days after production.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* SVG Filter for Liquify Effect */}
            <svg style={{ position: 'absolute', width: 0, height: 0 }} aria-hidden="true" focusable="false">
                <defs>
                    <filter id="liquify" x="-20%" y="-20%" width="140%" height="140%">
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
                .buy-now-btn {
                    isolation: isolate;
                    overflow: hidden;
                }
                .liquid-bg {
                    filter: url(#liquify);
                    pointer-events: none;
                    z-index: 1; /* Explicitly above the button base but below the text */
                    background-color: white !important;
                    opacity: 1;
                }
                .buy-now-btn:hover .liquid-bg {
                    transform: translateY(0);
                }
                .buy-now-btn span {
                    z-index: 2; /* Ensure text is always above the liquid background */
                }
                @keyframes expand {
                    from { transform: scaleX(0); }
                    to { transform: scaleX(1); }
                }
                .animate-expand {
                    animation: expand 0.4s ease forwards;
                    transform-origin: left;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.5s ease forwards;
                }
            `}</style>
        </div>
    );
}
