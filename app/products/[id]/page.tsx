'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useCart } from '../../providers/CartProvider';
import { useSession } from 'next-auth/react';

export default function ProductDetailPage() {
    const params = useParams();
    const id = params?.id as string;
    const router = useRouter();

    const [product, setProduct] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasMounted, setHasMounted] = useState(false);
    const [activeTab, setActiveTab] = useState('description');
    const [isLiked, setIsLiked] = useState(false);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const { addToCart, cartCount } = useCart();
    const { data: session } = useSession();
    const [isLiking, setIsLiking] = useState(false);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');

    const containerRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) return;
            setIsLoading(true);

            try {
                const res = await fetch(`/api/products/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setProduct(data);

                    // Check if liked if logged in
                    if (session?.user?.email) {
                        const likesRes = await fetch('/api/likes');
                        if (likesRes.ok) {
                            const likedProducts = await likesRes.json();
                            const liked = likedProducts.some((p: any) => p.id === id || p._id === id);
                            setIsLiked(liked);
                        }
                    }
                } else {
                    console.error('Product not found');
                }
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProduct();
    }, [id, session]);

    useEffect(() => {
        if (isLoading || !product) return;

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
        }, containerRef);

        return () => ctx.revert();
    }, [isLoading, product]);

    if (!hasMounted || isLoading) {
        return (
            <div
                className="bg-black min-h-screen text-white flex items-center justify-center"
                suppressHydrationWarning
            >
                <div className="text-xl font-thin tracking-widest animate-pulse">LOADING MASTERPIECE...</div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="bg-black min-h-screen text-white flex flex-col items-center justify-center gap-6">
                <div className="text-2xl font-thin tracking-widest text-white/40 uppercase">PRODUCT NOT FOUND</div>
                <Link href="/" className="text-[10px] uppercase tracking-widest border border-white/20 px-8 py-3 hover:bg-white/5 transition-colors">Return to Home</Link>
            </div>
        );
    }

    // Get all images
    const allImages = product.images || [product.image];
    const currentImageData = allImages[activeImageIndex];
    const currentImageUrl = typeof currentImageData === 'string' ? currentImageData : currentImageData?.url;
    const currentImageAlt = typeof currentImageData === 'string' ? product.name : currentImageData?.alt || product.name;

    return (
        <div
            className="bg-black min-h-screen text-white font-['Helvetica_Neue',Arial,sans-serif]"
            ref={containerRef}
            suppressHydrationWarning
        >
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 md:pt-32 pb-12 md:pb-20">
                {/* Breadcrumb - Horizontal Scroll on Mobile */}
                <nav className="mb-8 md:mb-12 w-full overflow-x-auto no-scrollbar">
                    <div className="flex items-center gap-2 text-[10px] sm:text-xs uppercase tracking-[0.2em] text-white/40 whitespace-nowrap">
                        <Link href="/" className="hover:text-white transition-colors">Home</Link>
                        <span>/</span>
                        {product.category ? (
                            <Link href={`/products?category=${product.category}`} className="hover:text-white transition-colors">
                                {product.category}
                            </Link>
                        ) : (
                            <Link href="/products" className="hover:text-white transition-colors">Products</Link>
                        )}
                        <span>/</span>
                        <span className="text-white/80">{product.name || product.title}</span>
                    </div>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 lg:gap-24 items-start">
                    {/* Image Gallery Section */}
                    <div ref={imageRef} className="space-y-4">
                        {/* Main Image */}
                        <div className="relative aspect-[3/4] bg-neutral-900 overflow-hidden group">
                            <Image
                                src={currentImageUrl}
                                alt={currentImageAlt}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                priority
                                quality={90}
                                loading="eager"
                            />
                            <div className="absolute inset-0 border border-white/10 pointer-events-none" />

                            {/* Image Counter */}
                            {allImages.length > 1 && (
                                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1.5 text-[10px] tracking-wider border border-white/20">
                                    {activeImageIndex + 1} / {allImages.length}
                                </div>
                            )}
                        </div>

                        {/* Thumbnail Gallery */}
                        {allImages.length > 1 && (
                            <div className="flex gap-2 sm:gap-3 justify-start sm:justify-center overflow-x-auto overflow-y-visible no-scrollbar py-2 scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                                {allImages.map((img: any, idx: number, arr: any[]) => {
                                    const imgUrl = typeof img === 'string' ? img : img.url;
                                    const imgAlt = typeof img === 'string' ? `${product.name} view ${idx + 1}` : img.alt;
                                    const isLast = idx === arr.length - 1;
                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveImageIndex(idx)}
                                            onTouchEnd={(e) => {
                                                e.preventDefault();
                                                setActiveImageIndex(idx);
                                            }}
                                            className={`relative flex-shrink-0 w-14 h-14 min-w-[56px] min-h-[56px] sm:w-16 sm:h-16 sm:min-w-[64px] sm:min-h-[64px] border transition-all duration-300 touch-manipulation cursor-pointer active:scale-95 [-webkit-tap-highlight-color:transparent] ${isLast ? 'mr-16 sm:mr-0' : ''} ${activeImageIndex === idx
                                                ? 'border-white shadow-lg shadow-white/20 opacity-100'
                                                : 'border-white/20 opacity-60 hover:opacity-100 hover:border-white/40'
                                                }`}
                                            type="button"
                                            aria-label={`View ${imgAlt}`}
                                        >
                                            <Image
                                                src={imgUrl}
                                                alt={imgAlt}
                                                fill
                                                className="object-cover pointer-events-none select-none"
                                                quality={75}
                                                sizes="64px"
                                                draggable={false}
                                            />
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Product Info Section */}
                    <div ref={contentRef} className="flex flex-col">
                        <span className="text-[10px] sm:text-xs font-light uppercase tracking-[0.4em] text-white/40 mb-3 sm:mb-4">{product.category}</span>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-thin leading-tight mb-4 sm:mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                            {product.name || product.title}
                        </h1>

                        <div className="flex items-center gap-4 mb-6 sm:mb-8">
                            <span className="text-2xl sm:text-3xl font-light">
                                {(() => {
                                    // Calculate dynamic price
                                    let currentPrice = Number(product.price);
                                    let currentOriginalPrice = Number(product.originalPrice);

                                    // Parse Variants
                                    const parseVariants = (variants: any) => {
                                        if (Array.isArray(variants)) return variants;
                                        if (typeof variants === 'string' && variants.length > 0) {
                                            return variants.split(',').map(s => ({ name: s.trim(), price: 0 }));
                                        }
                                        return [];
                                    };

                                    const sizes = parseVariants(product.sizes);
                                    const colors = parseVariants(product.colors);

                                    const sizeObj = sizes.find((s: any) => s.name === selectedSize);
                                    const colorObj = colors.find((c: any) => c.name === selectedColor);

                                    // Override Base Price with Variant Price if set
                                    if (sizeObj && Number(sizeObj.price) > 0) {
                                        currentPrice = Number(sizeObj.price);
                                        if (sizeObj.originalPrice) currentOriginalPrice = Number(sizeObj.originalPrice);
                                    }

                                    // If color has price, it also overrides (or you can decide logic here, e.g. strictly override)
                                    // Assuming strict override for now based on "Fixed Price" label
                                    if (colorObj && Number(colorObj.price) > 0) {
                                        currentPrice = Number(colorObj.price);
                                        if (colorObj.originalPrice) currentOriginalPrice = Number(colorObj.originalPrice);
                                    }

                                    return (
                                        <>
                                            {`₹${currentPrice.toLocaleString('en-IN')}`}
                                            {currentOriginalPrice > currentPrice && (
                                                <>
                                                    <span className="text-lg sm:text-xl text-white/30 line-through ml-4">₹{currentOriginalPrice.toLocaleString('en-IN')}</span>
                                                    <span className="bg-white/10 px-2 py-1 text-[9px] sm:text-[10px] tracking-widest uppercase border border-white/10 ml-3">
                                                        {Math.round((1 - currentPrice / currentOriginalPrice) * 100)}% OFF
                                                    </span>
                                                </>
                                            )}
                                        </>
                                    );
                                })()}
                            </span>
                        </div>

                        <p className="text-white/60 font-thin leading-relaxed tracking-wide mb-8 sm:mb-10 text-base sm:text-lg">
                            {product.description}
                        </p>

                        {/* Variants Section */}
                        <div className="space-y-8 mb-12">
                            {product.sizes && (product.sizes.length > 0) && (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-end">
                                        <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-medium">Select Size</label>
                                        <span className="text-[9px] uppercase tracking-widest text-white/20">{selectedSize || 'Required'}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        {(() => {
                                            const variants = Array.isArray(product.sizes)
                                                ? product.sizes
                                                : (typeof product.sizes === 'string' ? product.sizes.split(',').map((s: any) => ({ name: s.trim(), price: 0 })) : []);

                                            return variants.map((size: any) => {
                                                const s = size.name || size; // Handle obj or string
                                                const price = Number(size.price || 0);
                                                return (
                                                    <button
                                                        key={s}
                                                        onClick={() => setSelectedSize(s)}
                                                        className={`min-w-[50px] h-[50px] px-4 flex items-center justify-center border text-[10px] tracking-widest uppercase transition-all duration-300 ${selectedSize === s
                                                            ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.15)]'
                                                            : 'border-white/10 text-white/40 hover:border-white/30 hover:text-white'
                                                            }`}
                                                    >
                                                        {s}
                                                    </button>
                                                )
                                            });
                                        })()}
                                    </div>
                                </div>
                            )}

                            {product.colors && (product.colors.length > 0) && (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-end">
                                        <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-medium">Select Color</label>
                                        <span className="text-[9px] uppercase tracking-widest text-white/20">{selectedColor || 'Required'}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        {(() => {
                                            const variants = Array.isArray(product.colors)
                                                ? product.colors
                                                : (typeof product.colors === 'string' ? product.colors.split(',').map((c: any) => ({ name: c.trim(), price: 0 })) : []);

                                            return variants.map((color: any) => {
                                                const c = color.name || color;
                                                const price = Number(color.price || 0);

                                                return (
                                                    <button
                                                        key={c}
                                                        onClick={() => setSelectedColor(c)}
                                                        className={`px-6 h-[50px] flex items-center justify-center border text-[10px] tracking-widest uppercase transition-all duration-300 ${selectedColor === c
                                                            ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.15)]'
                                                            : 'border-white/10 text-white/40 hover:border-white/30 hover:text-white'
                                                            }`}
                                                    >
                                                        {c}
                                                    </button>
                                                )
                                            });
                                        })()}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-3 sm:gap-4 mb-12 sm:mb-16">
                            <div className="flex gap-3 sm:gap-4">
                                {/* Like Button */}
                                <button
                                    onClick={async () => {
                                        if (!session) {
                                            router.push('/login');
                                            return;
                                        }
                                        if (isLiking) return;
                                        setIsLiking(true);
                                        try {
                                            const res = await fetch('/api/likes', {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({ productId: product.id || product._id })
                                            });
                                            if (res.ok) {
                                                const data = await res.json();
                                                setIsLiked(data.liked);
                                            }
                                        } finally {
                                            setIsLiking(false);
                                        }
                                    }}
                                    className={`border border-white/20 text-white py-4 sm:py-5 px-6 sm:px-8 hover:bg-white/5 transition-all duration-300 group touch-manipulation active:scale-95 ${isLiking ? 'opacity-50' : ''}`}
                                    aria-label="Like product"
                                    disabled={isLiking}
                                >
                                    <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill={isLiked ? "currentColor" : "none"}
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        className="transition-all duration-300"
                                    >
                                        <path
                                            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </button>

                                {/* Add to Cart Button */}
                                <button
                                    onClick={() => {
                                        if (product.sizes && product.sizes.length > 0 && !selectedSize) {
                                            alert('Please select a size');
                                            return;
                                        }
                                        if (product.colors && product.colors.length > 0 && !selectedColor) {
                                            alert('Please select a color');
                                            return;
                                        }

                                        // Calculate final price for cart
                                        let finalPrice = Number(product.price);
                                        const variants = (arr: any) => Array.isArray(arr) ? arr : (typeof arr === 'string' ? arr.split(',').map((x: any) => ({ name: x.trim(), price: 0 })) : []);
                                        const sizeObj = variants(product.sizes).find((s: any) => s.name === selectedSize);
                                        const colorObj = variants(product.colors).find((c: any) => c.name === selectedColor);

                                        if (sizeObj && Number(sizeObj.price) > 0) finalPrice = Number(sizeObj.price);
                                        if (colorObj && Number(colorObj.price) > 0) finalPrice = Number(colorObj.price);

                                        addToCart({ ...product, price: finalPrice, selectedSize, selectedColor });
                                        router.push('/cart');
                                    }}
                                    className="flex-1 bg-white text-black py-4 sm:py-5 px-6 text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] border border-white hover:bg-gray-100 transition-all duration-300 flex items-center justify-center gap-3 relative touch-manipulation active:scale-95"
                                >
                                    <div className="relative">
                                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        {cartCount > 0 && (
                                            <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[8px] font-black min-w-[16px] h-[16px] rounded-full flex items-center justify-center border-2 border-black">
                                                {cartCount}
                                            </span>
                                        )}
                                    </div>
                                    <span>Add to Cart</span>
                                </button>
                            </div>

                            {/* Buy Now Button */}
                            <button
                                onClick={() => {
                                    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
                                        alert('Please select a size');
                                        return;
                                    }
                                    if (product.colors && product.colors.length > 0 && !selectedColor) {
                                        alert('Please select a color');
                                        return;
                                    }

                                    // Calculate final price for cart
                                    let finalPrice = Number(product.price);
                                    const variants = (arr: any) => Array.isArray(arr) ? arr : (typeof arr === 'string' ? arr.split(',').map((x: any) => ({ name: x.trim(), price: 0 })) : []);
                                    const sizeObj = variants(product.sizes).find((s: any) => s.name === selectedSize);
                                    const colorObj = variants(product.colors).find((c: any) => c.name === selectedColor);

                                    if (sizeObj && Number(sizeObj.price) > 0) finalPrice = Number(sizeObj.price);
                                    if (colorObj && Number(colorObj.price) > 0) finalPrice = Number(colorObj.price);

                                    addToCart({ ...product, price: finalPrice, selectedSize, selectedColor });
                                    router.push('/checkout');
                                }}
                                className="w-full border-2 border-white text-white py-4 sm:py-5 text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-300 touch-manipulation active:scale-95"
                            >
                                Buy Now
                            </button>
                        </div>

                        {/* Product Details Tabs */}
                        <div className="border-t border-white/10 pt-8 sm:pt-10">
                            <div className="flex gap-6 sm:gap-8 mb-6 sm:mb-8 border-b border-white/5 pb-4 overflow-x-auto no-scrollbar">
                                {['description', 'specifications', 'shipping'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`text-[9px] sm:text-[10px] uppercase tracking-[0.3em] transition-all relative pb-4 whitespace-nowrap touch-manipulation ${activeTab === tab ? 'text-white' : 'text-white/30 hover:text-white/60'}`}
                                    >
                                        {tab}
                                        {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white animate-expand" />}
                                    </button>
                                ))}
                            </div>

                            <div className="min-h-[150px]">
                                {activeTab === 'description' && (
                                    <div className="text-white/50 font-thin text-sm leading-relaxed space-y-4 animate-fadeIn">
                                        <p>{product.description || 'No description available.'}</p>
                                    </div>
                                )}
                                {activeTab === 'specifications' && (
                                    <ul className="space-y-3 animate-fadeIn">
                                        {(product.specifications?.split('\n') || ['Premium 3D Printed Finish', 'Eco-friendly Materials']).map((spec: string, i: number) => (
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

            <Footer />

            <style jsx>{`
                @keyframes expand { from { transform: scaleX(0); } to { transform: scaleX(1); } }
                .animate-expand { animation: expand 0.4s ease forwards; transform-origin: left; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fadeIn { animation: fadeIn 0.5s ease forwards; }
            `}</style>
        </div>
    );
}
