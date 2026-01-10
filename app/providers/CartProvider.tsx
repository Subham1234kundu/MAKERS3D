'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

interface CartItem {
    id: number | string;
    title?: string;
    name?: string;
    price: number;
    image?: string;
    images?: (string | { url: string; alt: string })[];
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
    const { data: session } = useSession();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [showToast, setShowToast] = useState(false);
    const [lastAddedItem, setLastAddedItem] = useState<CartItem | null>(null);

    // Fetch cart on load/session change
    useEffect(() => {
        const fetchCart = async () => {
            if (session?.user?.email) {
                try {
                    const res = await fetch('/api/cart');
                    if (res.ok) {
                        const data = await res.json();
                        setCartItems(data.items);
                    }
                } catch (error) {
                    console.error('Failed to fetch cart', error);
                }
            } else {
                // Load from localStorage for guest
                const savedCart = localStorage.getItem('cart');
                if (savedCart) {
                    try {
                        setCartItems(JSON.parse(savedCart));
                    } catch (e) {
                        console.error('Failed to parse cart', e);
                    }
                }
            }
        };

        fetchCart();
    }, [session]);

    // Save cart to localStorage only if NOT authenticated
    useEffect(() => {
        if (!session?.user?.email) {
            localStorage.setItem('cart', JSON.stringify(cartItems));
        }
    }, [cartItems, session]);

    const addToCart = async (product: any) => {
        // Optimistic UI update
        const prevCart = [...cartItems];
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

        if (session?.user?.email) {
            try {
                await fetch('/api/cart', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ product })
                });
                // Optionally refetch to ensure sync, but optimistic is smoother
            } catch (error) {
                console.error('Failed to add to cart DB', error);
                setCartItems(prevCart); // Revert on error
            }
        }
    };

    const removeFromCart = async (id: number | string) => {
        const prevCart = [...cartItems];
        setCartItems(prev => prev.filter(item => item.id !== id));

        if (session?.user?.email) {
            try {
                await fetch(`/api/cart?itemId=${id}`, {
                    method: 'DELETE'
                });
            } catch (error) {
                console.error('Failed to remove from cart DB', error);
                setCartItems(prevCart);
            }
        }
    };

    const updateQuantity = async (id: number | string, delta: number) => {
        const prevCart = [...cartItems];
        let newQuantity = 0;

        setCartItems(prev => prev.map(item => {
            if (item.id === id) {
                newQuantity = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQuantity };
            }
            return item;
        }));

        if (session?.user?.email) {
            try {
                await fetch('/api/cart', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ itemId: id, quantity: newQuantity })
                });
            } catch (error) {
                console.error('Failed to update quantity DB', error);
                setCartItems(prevCart);
            }
        }
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
                <>
                    {/* Mobile Toast - Pill shape, Top center middle */}
                    <Link
                        href="/cart"
                        onClick={() => setShowToast(false)}
                        className="sm:hidden fixed top-12 left-0 right-0 z-[10000] flex justify-center pointer-events-auto animate-toast-top-in"
                    >
                        <div className="bg-black/80 backdrop-blur-xl text-white px-6 py-2.5 rounded-full border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.5)] flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] whitespace-nowrap">Cart Added</span>
                        </div>
                    </Link>

                    {/* Desktop Toast - Detailed, Bottom right */}
                    <div className="hidden sm:block fixed bottom-8 right-8 z-[2000] animate-toast-in w-auto">
                        <div className="group relative">
                            <Link
                                href="/cart"
                                onClick={() => setShowToast(false)}
                                className="bg-white text-black p-4 pr-12 shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center gap-4 min-w-[320px] border-l-4 border-black relative block hover:bg-gray-50 transition-colors"
                            >
                                <div className="relative w-12 h-12 bg-gray-100 flex-shrink-0">
                                    <img
                                        src={typeof lastAddedItem.images?.[0] === 'string' ? lastAddedItem.images[0] : (lastAddedItem.images?.[0]?.url || lastAddedItem.image)}
                                        alt={typeof lastAddedItem.images?.[0] === 'object' ? lastAddedItem.images[0].alt : (lastAddedItem.name || lastAddedItem.title || 'Product')}
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[9px] uppercase tracking-[0.2em] text-black/40 font-bold mb-0.5">Added to Collection</p>
                                    <p className="text-sm font-light truncate mb-1">{lastAddedItem.name || lastAddedItem.title}</p>
                                    <span className="text-[10px] font-bold uppercase tracking-widest border-b border-black/20 group-hover:border-black transition-colors">
                                        View Collection
                                    </span>
                                </div>
                            </Link>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setShowToast(false);
                                }}
                                className="absolute top-4 right-4 text-black/20 hover:text-black transition-colors z-10"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </>
            )}
            <style jsx>{`
                @keyframes toast-in {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes toast-top-in {
                    from { transform: translateY(-100%); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .animate-toast-in {
                    animation: toast-in 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                }
                .animate-toast-top-in {
                    animation: toast-top-in 0.6s cubic-bezier(0.23, 1, 0.32, 1) forwards;
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
