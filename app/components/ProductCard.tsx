'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '../providers/CartProvider';

interface ProductCardProps {
    id: number | string;
    image: string;
    title: string;
    price: number;
    originalPrice: number;
    category?: string; // Added category
}

export default function ProductCard({ id, image, title, price, originalPrice, category = 'ALL' }: ProductCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [isPlusHovered, setIsPlusHovered] = useState(false);
    const { addToCart } = useCart();

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart({ id, image, title, price, originalPrice, category });
    };

    return (
        <div
            className="group relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Link href={`/products/${id}`}>
                <div className="cursor-pointer">
                    {/* Image Container */}
                    <div className="relative aspect-[3/4] mb-3 sm:mb-4 overflow-hidden transition-all duration-300 bg-black">
                        {/* Image */}
                        <Image
                            src={image}
                            alt={title}
                            fill
                            className="object-cover object-center"
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />

                        {/* Border - Black by default, Gray on hover */}
                        <div className={`absolute inset-0 border transition-colors duration-300 ${isHovered ? 'border-gray-500' : 'border-white/5'
                            }`}></div>
                    </div>

                    {/* Text Content - Centered with padding */}
                    <div className="px-2">
                        {/* Product Title */}
                        <h3 className="text-white font-thin text-base mb-2 tracking-wide text-center">
                            {title}
                        </h3>

                        {/* Price Section */}
                        <div className="flex items-center gap-3 justify-center">
                            <span className="text-white font-normal text-sm">
                                ₹{price.toLocaleString('en-IN')}
                            </span>
                            <span className="text-gray-500 font-normal text-sm line-through">
                                ₹{originalPrice.toLocaleString('en-IN')}
                            </span>
                        </div>
                    </div>
                </div>
            </Link>

            {/* Plus Icon - Outside Link to avoid nesting issue, always visible on mobile */}
            <button
                type="button"
                className={`absolute bottom-[110px] right-3 sm:bottom-[120px] sm:right-4 w-11 h-11 sm:w-12 sm:h-12 bg-white flex items-center justify-center transition-all duration-300 cursor-pointer lg:opacity-0 lg:-translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 active:scale-90 z-20 ${isPlusHovered ? 'bg-gray-100' : ''
                    }`}
                onMouseEnter={() => setIsPlusHovered(true)}
                onMouseLeave={() => setIsPlusHovered(false)}
                onClick={(e) => {
                    handleAddToCart(e);
                    const icon = e.currentTarget.querySelector('.plus-icon');
                    if (icon) {
                        icon.animate([
                            { transform: 'rotate(0deg)' },
                            { transform: 'rotate(360deg)' }
                        ], {
                            duration: 700,
                            easing: 'cubic-bezier(0.23, 1, 0.32, 1)'
                        });
                    }
                }}
                aria-label="Add to cart"
            >
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`plus-icon transition-transform duration-300 ${isPlusHovered ? 'scale-110' : 'scale-100'}`}
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
    );
}
