'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import Link from 'next/link';

interface CartItem {
    id: number | string;
    title: string;
    price: number;
    image: string;
    category: string;
    quantity: number;
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (product: any) => void;
    removeFromCart: (id: number | string) => void;
    updateQuantity: (id: number | string, delta: number) => void;
    clearCart: () => void;
    cartCount: number;
    cartTotal: number;
    showToast: boolean;
    lastAddedItem: CartItem | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [showToast, setShowToast] = useState(false);
    const [lastAddedItem, setLastAddedItem] = useState<CartItem | null>(null);

    // Load cart from localStorage
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            try {
                setCartItems(JSON.parse(savedCart));
            } catch (e) {
                console.error('Failed to parse cart', e);
            }
        }
    }, []);

    // Save cart to localStorage
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product: any) => {
        setCartItems(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });

        setLastAddedItem({ ...product, quantity: 1 });
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const removeFromCart = (id: number | string) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    const updateQuantity = (id: number | string, delta: number) => {
        setCartItems(prev => prev.map(item => {
            if (item.id === id) {
                return { ...item, quantity: Math.max(1, item.quantity + delta) };
            }
            return item;
        }));
    };

    const clearCart = () => setCartItems([]);

    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const cartTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            cartCount,
            cartTotal,
            showToast,
            lastAddedItem
        }}>
            {children}
            {/* Toast Notification */}
            {showToast && lastAddedItem && (
                <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-[2000] animate-toast-in px-4 sm:px-0 w-full sm:w-auto">
                    <div className="bg-white text-black p-4 pr-12 shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center gap-4 min-w-full sm:min-w-[320px] border-l-4 border-black relative">
                        <div className="relative w-12 h-12 bg-gray-100 flex-shrink-0">
                            <img src={lastAddedItem.image} alt="" className="object-cover w-full h-full" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[9px] uppercase tracking-[0.2em] text-black/40 font-bold mb-0.5">Added to Collection</p>
                            <p className="text-sm font-light truncate mb-1">{lastAddedItem.title}</p>
                            <Link href="/cart" className="text-[10px] font-bold uppercase tracking-widest border-b border-black/20 hover:border-black transition-colors" onClick={() => setShowToast(false)}>
                                View Collection
                            </Link>
                        </div>
                        <button
                            onClick={() => setShowToast(false)}
                            className="absolute top-4 right-4 text-black/20 hover:text-black transition-colors"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
            <style jsx>{`
                @keyframes toast-in {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                .animate-toast-in {
                    animation: toast-in 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                }
            `}</style>
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
