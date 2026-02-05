'use client';

import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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

    const generateBill = () => {
        const doc: any = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        // Logo Section
        doc.setFontSize(28);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text('MAKERS', 20, 25);

        const makersWidth = doc.getTextWidth('MAKERS');
        doc.setTextColor(150, 150, 150);
        doc.text('3D', 20 + makersWidth + 1, 25);

        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(100, 100, 100);
        doc.text('STUDIO_CORE', 20, 31);

        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(150, 150, 150);
        doc.text('PREMIUM 3D MASTERPIECES', 20, 35);

        // Header Line
        doc.setDrawColor(230, 230, 230);
        doc.setLineWidth(0.5);
        doc.line(20, 40, pageWidth - 20, 40);

        // Invoice Info (Right Aligned)
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text('INVOICE', pageWidth - 20, 30, { align: 'right' });

        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 100, 100);
        doc.text(`Order: #${order.id.slice(0, 12)}`, pageWidth - 20, 35, { align: 'right' });
        doc.text(`Date: ${order.date}`, pageWidth - 20, 40, { align: 'right' });

        // Bill Details Section
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text('BILL TO:', 20, 55);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(60, 60, 60);
        doc.text(order.customer, 20, 61);
        doc.text(order.email || '', 20, 66);
        doc.text(order.phone || '', 20, 71);

        // Payment Info
        doc.setFont('helvetica', 'bold');
        doc.text('PAYMENT:', 120, 55);
        doc.setFont('helvetica', 'normal');
        doc.text(`Method: ${order.payment_method?.toUpperCase() || 'UPI'}`, 120, 61);
        doc.text(`Status: PAID`, 120, 66);

        // Shipping Address
        if (order.address) {
            doc.setFont('helvetica', 'bold');
            doc.text('SHIPPING ADDRESS:', 20, 85);
            doc.setFont('helvetica', 'normal');
            const addr = typeof order.address === 'string' ? order.address :
                `${order.address.addressLine}, ${order.address.city}, ${order.address.state} - ${order.address.pincode}`;
            const splitAddress = doc.splitTextToSize(addr, 100);
            doc.text(splitAddress, 20, 91);
        }

        // Items Table
        const tableData = order.items?.map((item: any) => {
            let itemName = item.name;
            if (item.selectedSize) itemName += `\nSize: ${item.selectedSize}`;
            if (item.selectedColor) itemName += `\nColor: ${item.selectedColor}`;

            return [
                itemName,
                item.quantity || 1,
                `INR ${Number(item.price).toLocaleString('en-IN')}`,
                `INR ${(item.price * (item.quantity || 1)).toLocaleString('en-IN')}`
            ];
        }) || [[order.product, 1, order.amount, order.amount]];

        autoTable(doc, {
            startY: 110,
            head: [['PRODUCT DESCRIPTION', 'QTY', 'UNIT PRICE', 'TOTAL']],
            body: tableData,
            theme: 'striped',
            headStyles: { fillColor: [20, 20, 20], textColor: [255, 255, 255], fontSize: 8, fontStyle: 'bold' },
            bodyStyles: { fontSize: 9, textColor: [50, 50, 50] },
            alternateRowStyles: { fillColor: [250, 250, 250] },
            margin: { left: 20, right: 20 }
        });

        const finalY = (doc as any).lastAutoTable?.finalY || 180;

        // Totals
        doc.setDrawColor(230, 230, 230);
        doc.line(120, finalY + 5, pageWidth - 20, finalY + 5);

        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text('Grand Total:', 140, finalY + 15);
        doc.text(order.amount, pageWidth - 20, finalY + 15, { align: 'right' });

        // Footer
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text('This is a computer generated invoice and does not require a physical signature.', pageWidth / 2, 280, { align: 'center' });
        doc.setFont('helvetica', 'normal');
        doc.text('Thank you for choosing Makers3D Studio!', pageWidth / 2, 285, { align: 'center' });

        doc.save(`Invoice_${order.id}.pdf`);
    };

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
                                                <div className="flex gap-3 mt-1">
                                                    {item.selectedSize && (
                                                        <p className="text-[10px] text-white/50 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded-sm">Size: {item.selectedSize}</p>
                                                    )}
                                                    {item.selectedColor && (
                                                        <p className="text-[10px] text-white/50 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded-sm">Color: {item.selectedColor}</p>
                                                    )}
                                                </div>
                                                <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Qty: {item.quantity}</p>
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

                        {order.address && (
                            <div className="bg-white/5 p-4 rounded-sm border border-white/5">
                                <p className="text-[10px] text-white/40 uppercase tracking-widest mb-2">Shipping Address</p>
                                {typeof order.address === 'string' ? (
                                    <p className="text-sm font-light text-white/80">{order.address}</p>
                                ) : (
                                    <div className="space-y-1">
                                        <p className="text-sm font-light text-white/90">{order.address.addressLine}</p>
                                        <p className="text-sm font-light text-white/80">{order.address.city}, {order.address.state}</p>
                                        <p className="text-sm font-light text-white/80">PIN: {order.address.pincode}</p>
                                        {order.address.landmark && (
                                            <p className="text-xs text-white/40 italic">Landmark: {order.address.landmark}</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="space-y-4 pt-4 border-t border-white/5">
                            <div className="flex justify-between items-center mb-2">
                                <p className="text-[10px] text-white/40 uppercase tracking-widest">Actions</p>
                                <button
                                    onClick={generateBill}
                                    className="text-[10px] uppercase tracking-widest text-blue-400 hover:text-blue-300 flex items-center gap-2 transition-colors"
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                        <polyline points="7 10 12 15 17 10"></polyline>
                                        <line x1="12" y1="15" x2="12" y2="3"></line>
                                    </svg>
                                    Download Bill (PDF)
                                </button>
                            </div>

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
