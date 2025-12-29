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
        <Link href={`/products/${id}`}>
            <div
                className="group cursor-pointer"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
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

                    {/* Plus Icon - Slides from left to right on hover, always visible on mobile */}
                    <div
                        className={`absolute bottom-3 right-3 sm:bottom-4 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 bg-white flex items-center justify-center transition-all duration-300 cursor-pointer lg:opacity-0 lg:-translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 ${isPlusHovered ? 'bg-gray-100' : ''
                            }`}
                        onMouseEnter={() => setIsPlusHovered(true)}
                        onMouseLeave={() => setIsPlusHovered(false)}
                        onClick={handleAddToCart}
                    >
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className={`transition-transform duration-300 ${isPlusHovered ? 'rotate-90' : 'rotate-0'}`}
                        >
                            <path
                                d="M10 4V16M4 10H16"
                                stroke="black"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                            />
                        </svg>
                    </div>
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
    );
}
