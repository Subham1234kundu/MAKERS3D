'use client';

import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';

interface OrderDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: any;
    onUpdateStatus?: (orderId: string, newStatus: string) => void;
}

export default function OrderDetailsModal({ isOpen, onClose, order, onUpdateStatus }: OrderDetailsModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            gsap.fromTo(modalRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 0.3 }
            );
            gsap.fromTo(contentRef.current,
                { y: 20, opacity: 0, scale: 0.95 },
                { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out', delay: 0.1 }
            );
        }
    }, [isOpen]);

    if (!isOpen || !order) return null;

    const lowerStatus = order.status?.toLowerCase() || order.rawStatus || '';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                ref={modalRef}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            <div
                ref={contentRef}
                className="relative bg-[#0a0a0a] border border-white/10 w-full max-w-lg p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 blur-3xl rounded-full pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full pointer-events-none"></div>

                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Order Details</p>
                            <h2 className="text-2xl font-light text-white tracking-wide">{order.id}</h2>
                            <div className="mt-2">
                                <span className={`text-[10px] uppercase tracking-widest px-2 py-1 rounded-sm
                                    ${order.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-500' : ''}
                                    ${order.status === 'Pending Review' ? 'bg-orange-500/10 text-orange-500' : ''}
                                    ${order.status === 'Approved' ? 'bg-blue-500/10 text-blue-500' : ''}
                                    ${order.status === 'Shipped' ? 'bg-purple-500/10 text-purple-500' : ''}
                                    ${order.status === 'Delivered' ? 'bg-green-500/10 text-green-500' : ''}
                                    ${order.status === 'Cancelled' ? 'bg-red-500/10 text-red-500' : ''}
                                `}>
                                    {order.status}
                                </span>
                            </div>
                        </div>
                        <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Customer</p>
                                <p className="text-sm font-light text-white">{order.customer}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Date</p>
                                <p className="text-sm font-light text-white">{order.date}</p>
                            </div>
                        </div>

                        <div>
                            <p className="text-[10px] text-white/40 uppercase tracking-widest mb-2">Items</p>
                            <div className="space-y-3">
                                {order.items && order.items.length > 0 ? (
                                    order.items.map((item: any, i: number) => (
                                        <div key={i} className="flex items-center gap-4 bg-white/5 p-3 rounded-sm border border-white/5">
                                            <div className="w-12 h-16 bg-neutral-800 relative flex-shrink-0 overflow-hidden">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-light text-white">{item.name}</p>
                                                <p className="text-[10px] text-white/40 uppercase tracking-widest">Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm font-light text-white">{order.product}</p>
                                )}
                            </div>
                        </div>

                        {order.description && (
                            <div>
                                <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Description / Message</p>
                                <p className="text-sm font-light text-white/70 leading-relaxed bg-white/5 p-4 rounded-sm border border-white/5">
                                    {order.description}
                                </p>
                            </div>
                        )}

                        {order.tracking_number && (
                            <div>
                                <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Tracking Number</p>
                                <p className="text-sm font-mono text-purple-400 bg-purple-500/5 p-3 rounded-sm border border-purple-500/10">
                                    {order.tracking_number}
                                </p>
                            </div>
                        )}

                        <div className="space-y-4 pt-4 border-t border-white/5">
                            <p className="text-[10px] text-white/40 uppercase tracking-widest">Actions</p>

                            <div className="flex flex-wrap gap-3">
                                {(order.status === 'Pending' || order.status === 'Pending Review') && onUpdateStatus && (
                                    <button
                                        onClick={() => onUpdateStatus(order.id, 'Approved')}
                                        className="flex-1 flex justify-center items-center gap-2 px-6 py-3 bg-blue-600 text-white text-[10px] uppercase tracking-widest font-bold shadow-md hover:bg-blue-500 transition-all rounded-sm"
                                    >
                                        Approve Order
                                    </button>
                                )}

                                {order.status === 'Approved' && onUpdateStatus && (
                                    <button
                                        onClick={() => onUpdateStatus(order.id, 'Shipped')}
                                        className="flex-1 flex justify-center items-center gap-2 px-6 py-3 bg-purple-600 text-white text-[10px] uppercase tracking-widest font-bold shadow-md hover:bg-purple-500 transition-all rounded-sm"
                                    >
                                        Mark as Shipped
                                    </button>
                                )}

                                {order.status === 'Shipped' && onUpdateStatus && (
                                    <button
                                        onClick={() => onUpdateStatus(order.id, 'Delivered')}
                                        className="flex-1 flex justify-center items-center gap-2 px-6 py-3 bg-green-600 text-white text-[10px] uppercase tracking-widest font-bold shadow-md hover:bg-green-500 transition-all rounded-sm"
                                    >
                                        Mark as Delivered
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {order.phone && (
                                    <a
                                        href={`https://wa.me/${order.phone.replace(/\D/g, '')}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center justify-center gap-2 bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20 py-3 hover:bg-[#25D366] hover:text-white transition-all group"
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                                        </svg>
                                        <span className="text-xs uppercase tracking-widest">WhatsApp</span>
                                    </a>
                                )}

                                {order.email && (
                                    <a
                                        href={`mailto:${order.email}`}
                                        className="flex items-center justify-center gap-2 bg-blue-500/10 text-blue-500 border border-blue-500/20 py-3 hover:bg-blue-500 hover:text-white transition-all"
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                            <polyline points="22,6 12,13 2,6"></polyline>
                                        </svg>
                                        <span className="text-xs uppercase tracking-widest">Email</span>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
