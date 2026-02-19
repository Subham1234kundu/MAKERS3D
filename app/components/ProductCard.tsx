'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../providers/CartProvider';

interface ProductCardProps {
    id: number | string;
    image: string;
    alt?: string;
    secondImage?: string; // Second image for hover effect
    secondAlt?: string;   // Alt text for second image
    title: string;
    price: number;
    originalPrice: number;
    category?: string;
    fixedMobileHeight?: boolean; // Use fixed height on mobile for New Arrivals
}

export default function ProductCard({ id, image, alt, secondImage, secondAlt, title, price, originalPrice, category = 'ALL', fixedMobileHeight = false }: ProductCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [isPlusHovered, setIsPlusHovered] = useState(false);
    const router = useRouter();
    const { addToCart } = useCart();

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // Add to cart
        addToCart({ id, image, title, price, originalPrice, category });

        // Navigate to cart page after a brief delay for smooth UX
        setTimeout(() => {
            router.push('/cart');
        }, 300);
    };

    return (
        <div
            className="group relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={() => setIsHovered(true)}
            onTouchEnd={() => setTimeout(() => setIsHovered(false), 300)}
            suppressHydrationWarning
        >
            {/* Image Container */}
            <div className={`relative ${fixedMobileHeight ? 'h-[320px] sm:h-auto sm:aspect-[3/4]' : 'aspect-[3/4]'} mb-3 sm:mb-4 overflow-hidden transition-all duration-300 bg-black`}>
                <Link href={`/products/${id}`} className="absolute inset-0 z-0" suppressHydrationWarning>
                    <div className="w-full h-full cursor-pointer" suppressHydrationWarning>
                        {/* First Image */}
                        {image && (
                            <Image
                                src={image}
                                alt={alt || title}
                                fill
                                className={`object-cover object-center transition-opacity duration-500 ${isHovered && secondImage ? 'opacity-0' : 'opacity-100'
                                    }`}
                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                priority
                                quality={85}
                            />
                        )}

                        {/* Second Image - Shows on hover */}
                        {secondImage && (
                            <Image
                                src={secondImage}
                                alt={secondAlt || `${title} - alternate view`}
                                fill
                                className={`object-cover object-center transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'
                                    }`}
                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                quality={85}
                            />
                        )}

                        {!image && !secondImage && (
                            <div className="absolute inset-0 flex items-center justify-center text-white/20 text-xs">
                                No Image
                            </div>
                        )}

                        {/* Border - Black by default, Gray on hover */}
                        <div className={`absolute inset-0 border transition-colors duration-300 ${isHovered ? 'border-gray-500' : 'border-white/5'
                            }`}></div>
                    </div>
                </Link>

                {/* Plus Icon - Outside Link, positioned absolutely */}
                <button
                    type="button"
                    className={`absolute bottom-2 right-2 sm:bottom-3 sm:right-3
                        w-9 h-9 sm:w-11 sm:h-11
                        bg-white flex items-center justify-center
                        transition-all duration-300 cursor-pointer
                        lg:opacity-0 lg:-translate-x-4
                        group-hover:opacity-100 group-hover:translate-x-0
                        hover:scale-110 hover:bg-gray-100 active:scale-95
                        z-[60] touch-manipulation
                        ${isPlusHovered ? 'bg-gray-100 scale-110' : ''}
                        `}
                    onMouseEnter={() => setIsPlusHovered(true)}
                    onMouseLeave={() => setIsPlusHovered(false)}
                    suppressHydrationWarning
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        e.nativeEvent.stopImmediatePropagation(); // Ensure absolute stop
                        handleAddToCart(e);

                        // Rotate animation
                        const icon = e.currentTarget.querySelector('.plus-icon');
                        if (icon) {
                            icon.animate([
                                { transform: 'rotate(0deg) scale(1)' },
                                { transform: 'rotate(90deg) scale(1.2)' }, // Rotate 90 as requested
                                { transform: 'rotate(90deg) scale(1)' }
                            ], {
                                duration: 400,
                                fill: 'forwards',
                                easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
                            });
                        }
                    }}
                    aria-label="Add to cart"
                    style={{ WebkitTapHighlightColor: 'transparent', pointerEvents: 'auto' }}
                >
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className={`plus-icon transition-transform duration-500 ease-out sm:w-[18px] sm:h-[18px] pointer-events-none ${isPlusHovered ? 'rotate-90 scale-110' : 'rotate-0 scale-100'}`}
                        style={{ transformOrigin: 'center' }}
                    >
                        <path
                            d="M12 5V19M5 12H19"
                            stroke="black"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>
            </div>

            {/* Text Content - Centered with padding */}
            <Link href={`/products/${id}`} className="block" suppressHydrationWarning>
                <div className="px-2 cursor-pointer" suppressHydrationWarning>
                    {/* Product Title */}
                    <h3 className="text-white font-thin text-base mb-2 tracking-wide text-center" suppressHydrationWarning>
                        {title}
                    </h3>

                    {/* Price Section */}
                    <div className="flex items-center gap-3 justify-center" suppressHydrationWarning>
                        <span className="text-white font-normal text-sm" suppressHydrationWarning>
                            ₹{price.toLocaleString('en-IN')}
                        </span>
                        <span className="text-gray-500 font-normal text-sm line-through">
                            ₹{originalPrice.toLocaleString('en-IN')}
                        </span>
                    </div>
                </div>
            </Link>
        </div>
    );
}
