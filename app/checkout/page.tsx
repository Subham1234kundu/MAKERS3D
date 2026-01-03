'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../providers/CartProvider';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useSession } from 'next-auth/react';

export default function CheckoutPage() {
    const { cartItems, cartTotal, clearCart } = useCart();
    const { data: session } = useSession();
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentData, setPaymentData] = useState<any>(null);

    const [formData, setFormData] = useState({
        name: session?.user?.name || '',
        email: session?.user?.email || '',
        mobile: '',
        address: ''
    });

    useEffect(() => {
        if (!cartItems.length) {
            router.push('/cart');
        }
    }, [cartItems, router]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        try {
            const res = await fetch('/api/payment/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: cartTotal.toString(),
                    p_info: cartItems.map(item => item.name || item.title).join(', '),
                    customer_name: formData.name,
                    customer_email: formData.email,
                    customer_mobile: formData.mobile,
                    redirect_url: `${window.location.origin}/order-confirmation`
                })
            });

            const data = await res.json();

            if (data.success && data.data.payment_url) {
                // Store transaction ID for status verification on confirmation page
                localStorage.setItem('last_txn_id', data.client_txn_id);
                localStorage.setItem('last_txn_date', new Date().toLocaleDateString('en-GB').replace(/\//g, '-'));

                // Open Modal instead of immediate redirect
                setPaymentData(data);
                setShowPaymentModal(true);
            } else {
                alert(data.msg || 'Failed to initiate payment');
            }
        } catch (error) {
            console.error('Payment error:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    if (!cartItems.length) return null;

    return (
        <div className="bg-black min-h-screen text-white font-['Helvetica_Neue',Arial,sans-serif]">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 md:pt-32 pb-12 md:pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
                    {/* Checkout Form */}
                    <div className="space-y-8 animate-fadeIn">
                        <div>
                            <h1 className="text-3xl md:text-5xl font-thin tracking-tighter mb-4">Checkout</h1>
                            <p className="text-white/40 text-sm uppercase tracking-[0.2em]">Shipping & Contact Information</p>
                        </div>

                        <form onSubmit={handlePayment} className="space-y-6">
                            <div className="space-y-4">
                                <div className="group">
                                    <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 block mb-2 transition-colors group-focus-within:text-white">Full Name</label>
                                    <input
                                        required
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full bg-white/5 border border-white/10 px-5 py-4 text-sm text-white focus:outline-none focus:border-white transition-all font-light"
                                        placeholder="EX: JOHN DOE"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="group">
                                        <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 block mb-2">Email Address</label>
                                        <input
                                            required
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full bg-white/5 border border-white/10 px-5 py-4 text-sm text-white focus:outline-none focus:border-white transition-all font-light"
                                            placeholder="EMAIL@EXAMPLE.COM"
                                        />
                                    </div>
                                    <div className="group">
                                        <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 block mb-2">Mobile Number</label>
                                        <input
                                            required
                                            type="tel"
                                            name="mobile"
                                            value={formData.mobile}
                                            onChange={handleInputChange}
                                            className="w-full bg-white/5 border border-white/10 px-5 py-4 text-sm text-white focus:outline-none focus:border-white transition-all font-light"
                                            placeholder="9876543210"
                                        />
                                    </div>
                                </div>

                                <div className="group">
                                    <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 block mb-2">Detailed Address</label>
                                    <textarea
                                        required
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="w-full bg-white/5 border border-white/10 px-5 py-4 text-sm text-white focus:outline-none focus:border-white transition-all font-light resize-none"
                                        placeholder="STREET, AREA, PINCODE, CITY"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isProcessing}
                                className="w-full bg-white text-black py-5 text-[11px] font-bold uppercase tracking-[0.4em] transition-all hover:bg-gray-200 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
                            >
                                {isProcessing ? (
                                    <span className="animate-pulse">INITIALIZING GATEWAY...</span>
                                ) : (
                                    <>
                                        PAY ₹{cartTotal.toLocaleString('en-IN')} VIA UPI
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M5 12h14m-7-7l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </>
                                )}
                            </button>
                            <p className="text-center text-[9px] text-white/30 tracking-[0.2em] uppercase">Zero Transaction Fees • Secure UPI Payment</p>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:border-l lg:border-white/5 lg:pl-12 space-y-8 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                        <h2 className="text-xl font-thin tracking-widest uppercase">Your Order</h2>

                        <div className="space-y-6">
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex gap-4 items-center">
                                    <div className="relative w-16 h-20 bg-neutral-900 border border-white/5 overflow-hidden flex-shrink-0">
                                        <img src={item.images?.[0] || item.image} alt="" className="object-cover w-full h-full" />
                                        <span className="absolute -top-2 -right-2 bg-white text-black text-[9px] font-bold w-5 h-5 rounded-full flex items-center justify-center border border-black">
                                            {item.quantity}
                                        </span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-light tracking-wide">{item.name || item.title}</p>
                                        <p className="text-[10px] text-white/40 uppercase tracking-widest">{item.category}</p>
                                    </div>
                                    <p className="text-sm font-light">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                                </div>
                            ))}
                        </div>

                        <div className="pt-8 border-t border-white/5 space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-white/40 font-light">Subtotal</span>
                                <span className="font-light">₹{cartTotal.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-white/40 font-light">Shipping</span>
                                <span className="text-green-400 font-light">Calculated next step</span>
                            </div>
                            <div className="flex justify-between items-end pt-4">
                                <span className="text-xs uppercase tracking-[0.3em]">Total Amount</span>
                                <span className="text-2xl font-light">₹{cartTotal.toLocaleString('en-IN')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Payment Gateway Modal */}
            {showPaymentModal && paymentData && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center px-4 overflow-hidden">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/90 backdrop-blur-md animate-fadeIn"
                        onClick={() => setShowPaymentModal(false)}
                    />

                    {/* Modal Content */}
                    <div className="relative bg-[#0a0a0a] border border-white/10 w-full max-w-[400px] rounded-[2rem] overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.8)] animate-modalEntrance mx-auto">
                        {/* Header */}
                        <div className="bg-[#111] p-5 border-b border-white/5 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-[9px] text-white/40 uppercase tracking-[0.2em] font-bold">Secure Gateway</p>
                                    <p className="text-[11px] text-white font-medium tracking-tight">ORDER #{paymentData.order_id || paymentData.data?.order_id}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowPaymentModal(false)}
                                className="text-white/20 hover:text-white transition-colors p-1"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Amount Section & QR (Desktop Only) */}
                        <div className="p-6 sm:p-8 pb-4 text-center space-y-6">
                            <div className="space-y-1">
                                <p className="text-[10px] text-white/30 uppercase tracking-[0.2em]">Total Outstanding</p>
                                <h2 className="text-4xl sm:text-5xl font-thin tracking-tighter italic">₹{cartTotal.toLocaleString('en-IN')}</h2>
                            </div>

                            {/* QR Code - Hidden on Mobile */}
                            <div className="hidden sm:block space-y-4">
                                <div className="relative group mx-auto w-44 h-44 bg-white p-3 rounded-2xl shadow-[0_0_40px_rgba(255,255,255,0.03)] transition-all hover:scale-[1.02]">
                                    <img
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(paymentData.data?.payment_url || '')}`}
                                        alt="Payment QR"
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                <p className="text-[9px] text-white/20 uppercase tracking-[0.4em] font-medium">Scan with any UPI app</p>
                            </div>
                        </div>

                        {/* Payment Options Section */}
                        <div className="px-6 sm:px-8 pb-10 space-y-6">
                            <div className="space-y-5">
                                <div className="flex items-center gap-4">
                                    <div className="h-[1px] flex-1 bg-white/5"></div>
                                    <p className="text-[9px] text-white/40 uppercase tracking-[0.3em] font-bold whitespace-nowrap">Express Checkout</p>
                                    <div className="h-[1px] flex-1 bg-white/5"></div>
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    {/* Google Pay */}
                                    <button
                                        onClick={() => window.location.href = paymentData.data?.upi_intent?.gpay_link || paymentData.data?.payment_url}
                                        className="bg-white/[0.03] border border-white/5 hover:border-white/20 hover:bg-white/5 py-5 rounded-2xl flex flex-col items-center gap-3 transition-all group"
                                    >
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center overflow-hidden p-1.5 flex-shrink-0 transition-all group-hover:scale-110 group-active:scale-95 shadow-lg">
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" alt="GPay" className="w-full h-full object-contain" />
                                        </div>
                                        <span className="text-[8px] text-white/30 uppercase tracking-widest font-black group-hover:text-white/60 transition-colors">G-Pay</span>
                                    </button>

                                    {/* PhonePe */}
                                    <button
                                        onClick={() => window.location.href = paymentData.data?.upi_intent?.phonepe_link || paymentData.data?.payment_url}
                                        className="bg-white/[0.03] border border-white/5 hover:border-white/20 hover:bg-white/5 py-5 rounded-2xl flex flex-col items-center gap-3 transition-all group"
                                    >
                                        <div className="w-10 h-10 bg-[#5f259f] rounded-xl flex items-center justify-center p-2 flex-shrink-0 transition-all group-hover:scale-110 group-active:scale-95 shadow-lg">
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/7/71/PhonePe_Logo.svg" alt="PhonePe" className="w-full h-full object-contain brightness-0 invert" />
                                        </div>
                                        <span className="text-[8px] text-white/30 uppercase tracking-widest font-black group-hover:text-white/60 transition-colors">PhonePe</span>
                                    </button>

                                    {/* Amazon Pay */}
                                    <button
                                        onClick={() => window.location.href = paymentData.data?.payment_url}
                                        className="bg-white/[0.03] border border-white/5 hover:border-white/20 hover:bg-white/5 py-5 rounded-2xl flex flex-col items-center gap-3 transition-all group"
                                    >
                                        <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center p-1 flex-shrink-0 border border-white/10 transition-all group-hover:scale-110 group-active:scale-95 shadow-lg">
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon Pay" className="w-full h-full object-contain brightness-0 invert pt-1" />
                                        </div>
                                        <span className="text-[8px] text-white/30 uppercase tracking-widest font-black group-hover:text-white/60 transition-colors">Amazon</span>
                                    </button>
                                </div>
                            </div>

                            <div className="pt-2 flex flex-col items-center gap-3">
                                <div className="flex items-center gap-2 opacity-20">
                                    <div className="w-1 h-1 rounded-full bg-white"></div>
                                    <div className="w-1 h-1 rounded-full bg-white"></div>
                                    <div className="w-1 h-1 rounded-full bg-white"></div>
                                </div>
                                <p className="text-[8px] text-center text-white/10 tracking-[0.4em] uppercase font-bold">
                                    Makers3D Architectural Payment Mesh
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Footer />

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes modalEntrance {
                    from { opacity: 0; transform: scale(0.9) translateY(20px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.4s ease-out forwards;
                }
                .animate-modalEntrance {
                    animation: modalEntrance 0.5s cubic-bezier(0.19, 1, 0.22, 1) forwards;
                }
            `}</style>
        </div>
    );
}
