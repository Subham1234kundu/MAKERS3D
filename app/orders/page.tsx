'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface OrderItem {
    name: string;
    image: string;
}

interface Address {
    street?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
}

interface Order {
    id: string;
    orderId: string;
    date: string;
    dateTime: string;
    status: string;
    statusColor: string;
    rawStatus: string;
    total: number;
    items: OrderItem[];
    itemsText: string;
    payment_method: string;
    paymentMethodDisplay: string;
    address: Address;
    customerName: string;
    customerEmail: string;
    customerMobile: string;
    transactionId: string | null;
}

export default function OrdersPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [filter, setFilter] = useState<'all' | 'confirmed' | 'processing' | 'delivered'>('all');

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login?redirect=/orders');
        } else if (status === 'authenticated') {
            fetchOrders();
        }
    }, [status, router]);

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/user/orders');
            if (res.ok) {
                const data = await res.json();
                setOrders(data);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredOrders = orders.filter(order => {
        if (filter === 'all') return true;
        if (filter === 'confirmed') return ['Confirmed', 'Approved'].includes(order.status);
        if (filter === 'processing') return ['Processing', 'Shipped', 'COD - Awaiting Delivery'].includes(order.status);
        if (filter === 'delivered') return order.status === 'Delivered';
        return true;
    });

    const getStatusBadgeClasses = (color: string) => {
        switch (color) {
            case 'green':
                return 'bg-green-500/10 text-green-400 border-green-500/30';
            case 'blue':
                return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
            case 'purple':
                return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
            case 'yellow':
                return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
            case 'red':
                return 'bg-red-500/10 text-red-400 border-red-500/30';
            default:
                return 'bg-white/10 text-white/60 border-white/30';
        }
    };

    if (status === 'loading' || isLoading) {
        return (
            <div className="bg-black min-h-screen text-white">
                <Navbar />
                <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-32 pb-20">
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="text-center">
                            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-white/40 text-sm">Loading orders...</p>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="bg-black min-h-screen text-white font-['Helvetica_Neue',Arial,sans-serif]">
            <Navbar />

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
                    <div className="bg-[#111] border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-[#111] border-b border-white/10 p-6 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-1">Order Details</p>
                                <h3 className="text-xl font-thin tracking-wide">{selectedOrder.id}</h3>
                            </div>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="text-white/40 hover:text-white p-2"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 space-y-8">
                            {/* Status & Date */}
                            <div className="flex flex-wrap gap-6">
                                <div>
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2">Status</p>
                                    <span className={`inline-block px-3 py-1.5 text-[10px] uppercase tracking-widest border ${getStatusBadgeClasses(selectedOrder.statusColor)}`}>
                                        {selectedOrder.status}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2">Date</p>
                                    <p className="text-white/80">{selectedOrder.date}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2">Payment</p>
                                    <p className="text-white/80">{selectedOrder.paymentMethodDisplay}</p>
                                </div>
                                {selectedOrder.transactionId && (
                                    <div>
                                        <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2">Transaction ID</p>
                                        <p className="text-white/60 text-sm font-mono">{selectedOrder.transactionId}</p>
                                    </div>
                                )}
                            </div>

                            {/* Items */}
                            <div>
                                <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-4">Items Ordered</p>
                                <div className="space-y-3">
                                    {selectedOrder.items.length > 0 ? (
                                        selectedOrder.items.map((item, i) => (
                                            <div key={i} className="flex items-center gap-4 bg-white/5 p-4 border border-white/5">
                                                <div className="w-16 h-16 bg-neutral-800 flex-shrink-0">
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                </div>
                                                <span className="text-white/80">{item.name}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-white/40 text-sm">{selectedOrder.itemsText || 'No items'}</p>
                                    )}
                                </div>
                            </div>

                            {/* Delivery Address */}
                            {selectedOrder.address && Object.keys(selectedOrder.address).length > 0 && (
                                <div>
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-4">Delivery Address</p>
                                    <div className="bg-white/5 p-4 border border-white/5">
                                        <p className="text-white font-light mb-1">{selectedOrder.customerName}</p>
                                        <p className="text-white/60 text-sm leading-relaxed">
                                            {selectedOrder.address.street && <>{selectedOrder.address.street}<br /></>}
                                            {selectedOrder.address.city && <>{selectedOrder.address.city}, </>}
                                            {selectedOrder.address.state && <>{selectedOrder.address.state} </>}
                                            {selectedOrder.address.pincode && <>- {selectedOrder.address.pincode}</>}
                                        </p>
                                        {selectedOrder.customerMobile && (
                                            <p className="text-white/60 text-sm mt-2">Phone: {selectedOrder.customerMobile}</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Order Total */}
                            <div className="border-t border-white/10 pt-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">Order Total</span>
                                    <span className="text-2xl font-light">₹{selectedOrder.total.toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="border-t border-white/10 p-6 flex gap-4">
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="flex-1 bg-white/5 hover:bg-white/10 text-white py-3 text-[10px] uppercase tracking-[0.2em] transition-all"
                            >
                                Close
                            </button>
                            {selectedOrder.status === 'Delivered' && (
                                <button className="flex-1 bg-white text-black py-3 text-[10px] uppercase tracking-[0.2em] hover:bg-gray-200 transition-all">
                                    Request Return
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-32 pb-20">
                {/* Header */}
                <div className="mb-12 border-b border-white/10 pb-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-2">Your Account</p>
                            <h1 className="text-4xl md:text-5xl font-thin tracking-wide">My Orders</h1>
                        </div>
                        <Link
                            href="/profile"
                            className="text-[10px] uppercase tracking-[0.2em] text-white/60 hover:text-white border border-white/10 hover:border-white/40 px-6 py-3 transition-all"
                        >
                            Back to Profile
                        </Link>
                    </div>
                </div>

                {/* Filters */}
                <div className="mb-8 flex flex-wrap gap-3">
                    {[
                        { key: 'all', label: 'All Orders' },
                        { key: 'confirmed', label: 'Confirmed' },
                        { key: 'processing', label: 'In Progress' },
                        { key: 'delivered', label: 'Delivered' },
                    ].map((f) => (
                        <button
                            key={f.key}
                            onClick={() => setFilter(f.key as typeof filter)}
                            className={`px-4 py-2 text-[10px] uppercase tracking-[0.15em] border transition-all ${filter === f.key
                                    ? 'bg-white text-black border-white'
                                    : 'bg-transparent text-white/60 border-white/10 hover:border-white/40 hover:text-white'
                                }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                {/* Orders List */}
                {filteredOrders.length > 0 ? (
                    <div className="space-y-6">
                        {filteredOrders.map((order) => (
                            <div
                                key={order.id}
                                className="bg-neutral-900/30 border border-white/5 hover:border-white/20 transition-all group"
                            >
                                {/* Order Header */}
                                <div className="p-6 md:p-8 border-b border-white/5">
                                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                                        <div className="flex flex-wrap items-center gap-6">
                                            <div>
                                                <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-1">Order ID</p>
                                                <p className="text-lg font-light tracking-wide font-mono">{order.id}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-1">Date</p>
                                                <p className="text-sm font-light text-white/80">{order.date}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-1">Payment</p>
                                                <p className="text-sm font-light text-white/80">{order.paymentMethodDisplay}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="text-right">
                                                <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-1">Total</p>
                                                <p className="text-xl font-light">₹{order.total.toLocaleString('en-IN')}</p>
                                            </div>
                                            <span className={`px-3 py-1.5 text-[9px] uppercase tracking-widest border ${getStatusBadgeClasses(order.statusColor)}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Items Preview */}
                                <div className="p-6 md:px-8">
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-4">Items</p>
                                    <div className="flex flex-wrap gap-3 mb-6">
                                        {order.items.slice(0, 3).map((item, i) => (
                                            <div key={i} className="flex items-center gap-3 bg-black/40 px-4 py-2 border border-white/5">
                                                <div className="w-10 h-10 bg-neutral-800 flex-shrink-0">
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                </div>
                                                <span className="text-sm text-white/70 max-w-[200px] truncate">{item.name}</span>
                                            </div>
                                        ))}
                                        {order.items.length > 3 && (
                                            <div className="flex items-center px-4 py-2 text-white/40 text-sm">
                                                +{order.items.length - 3} more
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex justify-end gap-4">
                                        <button
                                            onClick={() => setSelectedOrder(order)}
                                            className="text-[10px] uppercase tracking-[0.2em] text-white border border-white/20 px-6 py-3 hover:bg-white hover:text-black transition-all"
                                        >
                                            View Details
                                        </button>
                                        {order.status === 'Delivered' && (
                                            <button className="text-[10px] uppercase tracking-[0.2em] text-white/60 border border-white/10 px-6 py-3 hover:border-white/40 hover:text-white transition-all">
                                                Request Return
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-white/30">
                                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <path d="M16 10a4 4 0 0 1-8 0" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-thin mb-2">No orders found</h3>
                        <p className="text-white/40 text-sm mb-8">
                            {filter === 'all'
                                ? "You haven't placed any orders yet."
                                : `No ${filter} orders found.`}
                        </p>
                        <Link
                            href="/products"
                            className="inline-block bg-white text-black px-8 py-4 text-[10px] uppercase tracking-[0.2em] hover:bg-gray-200 transition-all"
                        >
                            Start Shopping
                        </Link>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
