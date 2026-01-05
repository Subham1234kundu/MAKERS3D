'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../providers/CartProvider';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useSession } from 'next-auth/react';
import Script from 'next/script';

declare global {
    interface Window {
        EKQR: any;
    }
}

export default function CheckoutPage() {
    const { cartItems, cartTotal, clearCart } = useCart();
    const { data: session } = useSession();
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false); // Used for loading state during SDK init
    const [paymentData, setPaymentData] = useState<any>(null);
    const [paymentMethod, setPaymentMethod] = useState<'upi' | 'cod'>('upi');
    const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);

    const [formData, setFormData] = useState({
        name: session?.user?.name || '',
        email: session?.user?.email || '',
        mobile: '',
        street: '',
        city: '',
        state: '',
        pincode: ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const codCharge = paymentMethod === 'cod' ? Math.round(cartTotal * 0.1) : 0;
    const finalTotal = cartTotal + codCharge;

    useEffect(() => {
        if (!cartItems.length) {
            router.push('/cart');
        }
    }, [cartItems, router]);



    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) newErrors.name = 'Full name is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email address';
        if (!/^\d{10}$/.test(formData.mobile)) newErrors.mobile = 'Enter a valid 10-digit mobile number';

        if (formData.street.length < 10) newErrors.street = 'Please provide a detailed street address';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.state.trim()) newErrors.state = 'State is required';
        if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = 'Enter a valid 6-digit Pincode';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            const firstError = document.querySelector('.text-red-500');
            firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        setIsProcessing(true);
        const fullAddress = `${formData.street}, ${formData.city}, ${formData.state} - ${formData.pincode}`;

        try {
            const res = await fetch('/api/payment/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: finalTotal.toString(),
                    p_info: paymentMethod === 'cod'
                        ? cartItems.map(item => item.name || item.title).join(', ') + ' (Includes 10% COD Fee)'
                        : cartItems.map(item => item.name || item.title).join(', '),
                    customer_name: formData.name,
                    customer_email: formData.email,
                    customer_mobile: formData.mobile,
                    address: fullAddress,
                    payment_method: paymentMethod,
                    redirect_url: `${window.location.origin}/order-confirmation`
                })
            });

            const data = await res.json();

            if (data.success) {
                if (paymentMethod === 'cod') {
                    clearCart();
                    router.push(`/order-confirmation?id=${data.order_id}&method=cod`);
                } else {
                    localStorage.setItem('last_txn_id', data.client_txn_id);
                    localStorage.setItem('last_txn_date', new Date().toLocaleDateString('en-GB').replace(/\//g, '-'));

                    if (window.EKQR && data.data?.session_id) {
                        const paymentSDK = new window.EKQR({
                            sessionId: data.data.session_id,
                            callbacks: {
                                onSuccess: (response: any) => {
                                    console.log('Payment successful:', response);
                                    setIsPaymentSuccess(true);
                                    clearCart();
                                    router.push(`/order-confirmation?id=${data.client_txn_id}`);
                                },
                                onError: (response: any) => {
                                    console.error('Payment error:', response);
                                    alert('Payment failed. Please try again.');
                                },
                                onCancelled: (response: any) => {
                                    console.log('Payment cancelled:', response);
                                }
                            }
                        });
                        paymentSDK.pay();
                    } else {
                        // Fallback to payment URL if SDK fails or isn't loaded
                        window.location.href = data.data?.payment_url || '#';
                    }
                }
            } else {
                alert(data.msg || 'Failed to initiate checkout');
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

                        <form onSubmit={handlePayment} className="space-y-8">
                            <div className="space-y-6">
                                {/* Form Inputs */}
                                <div className="space-y-4">
                                    <div className="group">
                                        <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 block mb-2 transition-colors group-focus-within:text-white">Full Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className={`w-full bg-white/5 border ${errors.name ? 'border-red-500' : 'border-white/10'} px-5 py-4 text-sm text-white focus:outline-none focus:border-white transition-all font-light`}
                                            placeholder="EX: JOHN DOE"
                                        />
                                        {errors.name && <p className="text-red-500 text-[9px] mt-1 tracking-widest">{errors.name.toUpperCase()}</p>}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="group">
                                            <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 block mb-2">Email Address</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className={`w-full bg-white/5 border ${errors.email ? 'border-red-500' : 'border-white/10'} px-5 py-4 text-sm text-white focus:outline-none focus:border-white transition-all font-light`}
                                                placeholder="EMAIL@EXAMPLE.COM"
                                            />
                                            {errors.email && <p className="text-red-500 text-[9px] mt-1 tracking-widest">{errors.email.toUpperCase()}</p>}
                                        </div>
                                        <div className="group">
                                            <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 block mb-2">Mobile Number</label>
                                            <input
                                                type="tel"
                                                name="mobile"
                                                value={formData.mobile}
                                                onChange={handleInputChange}
                                                className={`w-full bg-white/5 border ${errors.mobile ? 'border-red-500' : 'border-white/10'} px-5 py-4 text-sm text-white focus:outline-none focus:border-white transition-all font-light`}
                                                placeholder="9876543210"
                                            />
                                            {errors.mobile && <p className="text-red-500 text-[9px] mt-1 tracking-widest">{errors.mobile.toUpperCase()}</p>}
                                        </div>
                                    </div>

                                    <div className="group">
                                        <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 block mb-2">Street Address</label>
                                        <input
                                            type="text"
                                            name="street"
                                            value={formData.street}
                                            onChange={handleInputChange}
                                            className={`w-full bg-white/5 border ${errors.street ? 'border-red-500' : 'border-white/10'} px-5 py-4 text-sm text-white focus:outline-none focus:border-white transition-all font-light`}
                                            placeholder="HOUSE NO, BUILDING NAME, STREET"
                                        />
                                        {errors.street && <p className="text-red-500 text-[9px] mt-1 tracking-widest">{errors.street.toUpperCase()}</p>}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="group">
                                            <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 block mb-2">City</label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                className={`w-full bg-white/5 border ${errors.city ? 'border-red-500' : 'border-white/10'} px-5 py-4 text-sm text-white focus:outline-none focus:border-white transition-all font-light`}
                                                placeholder="CITY"
                                            />
                                            {errors.city && <p className="text-red-500 text-[9px] mt-1 tracking-widest">{errors.city.toUpperCase()}</p>}
                                        </div>
                                        <div className="group">
                                            <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 block mb-2">State</label>
                                            <input
                                                type="text"
                                                name="state"
                                                value={formData.state}
                                                onChange={handleInputChange}
                                                className={`w-full bg-white/5 border ${errors.state ? 'border-red-500' : 'border-white/10'} px-5 py-4 text-sm text-white focus:outline-none focus:border-white transition-all font-light`}
                                                placeholder="STATE"
                                            />
                                            {errors.state && <p className="text-red-500 text-[9px] mt-1 tracking-widest">{errors.state.toUpperCase()}</p>}
                                        </div>
                                        <div className="group">
                                            <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 block mb-2">Pincode</label>
                                            <input
                                                type="text"
                                                name="pincode"
                                                maxLength={6}
                                                value={formData.pincode}
                                                onChange={handleInputChange}
                                                className={`w-full bg-white/5 border ${errors.pincode ? 'border-red-500' : 'border-white/10'} px-5 py-4 text-sm text-white focus:outline-none focus:border-white transition-all font-light`}
                                                placeholder="400001"
                                            />
                                            {errors.pincode && <p className="text-red-500 text-[9px] mt-1 tracking-widest">{errors.pincode.toUpperCase()}</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Method Selection */}
                                <div className="space-y-4 pt-4 border-t border-white/5">
                                    <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">Select Payment Method</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setPaymentMethod('upi')}
                                            className={`p-6 border transition-all text-left flex flex-col gap-2 ${paymentMethod === 'upi' ? 'bg-white text-black border-white' : 'bg-transparent border-white/10 text-white hover:border-white/30'}`}
                                        >
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] font-bold uppercase tracking-widest">Instant UPI</span>
                                                {paymentMethod === 'upi' && (
                                                    <div className="w-2 h-2 rounded-full bg-black"></div>
                                                )}
                                            </div>
                                            <p className="text-[9px] opacity-60 uppercase tracking-tighter">PhonePe, G-Pay, Amazon Pay</p>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setPaymentMethod('cod')}
                                            className={`p-6 border transition-all text-left flex flex-col gap-2 ${paymentMethod === 'cod' ? 'bg-white text-black border-white' : 'bg-transparent border-white/10 text-white hover:border-white/30'}`}
                                        >
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] font-bold uppercase tracking-widest">Cash on Delivery</span>
                                                {paymentMethod === 'cod' && (
                                                    <div className="w-2 h-2 rounded-full bg-black"></div>
                                                )}
                                            </div>
                                            <p className="text-[9px] opacity-60 uppercase tracking-tighter">Pay when you receive items</p>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isProcessing}
                                className="w-full bg-white text-black py-5 text-[11px] font-bold uppercase tracking-[0.4em] transition-all hover:bg-gray-200 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
                            >
                                {isProcessing ? (
                                    <span className="animate-pulse">PROCESSING...</span>
                                ) : (
                                    <>
                                        {paymentMethod === 'upi' ? `PAY ₹${finalTotal.toLocaleString('en-IN')} VIA UPI` : `CONFIRM COD ORDER (₹${finalTotal.toLocaleString('en-IN')})`}
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M5 12h14m-7-7l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </>
                                )}
                            </button>
                            <p className="text-center text-[9px] text-white/30 tracking-[0.2em] uppercase">Makers3D Built on Reliability • Secured Encryption</p>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:border-l lg:border-white/5 lg:pl-12 space-y-8 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                        <h2 className="text-xl font-thin tracking-widest uppercase">Your Order</h2>

                        <div className="space-y-6">
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex gap-4 items-center">
                                    <div className="relative w-16 h-20 bg-neutral-900 border border-white/5 overflow-hidden flex-shrink-0">
                                        <img
                                            src={typeof item.images?.[0] === 'string' ? item.images[0] : (item.images?.[0]?.url || item.image)}
                                            alt={typeof item.images?.[0] === 'object' ? item.images[0].alt : (item.name || item.title || 'Product')}
                                            className="object-cover w-full h-full"
                                        />
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
                            {paymentMethod === 'cod' && (
                                <div className="flex justify-between text-sm animate-fadeIn">
                                    <span className="text-white/40 font-light">COD Handling Fee (10%)</span>
                                    <span className="text-white/80 font-light">+ ₹{codCharge.toLocaleString('en-IN')}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-sm">
                                <span className="text-white/40 font-light">Shipping</span>
                                <span className="text-green-400 font-light uppercase tracking-widest text-[10px]">Free</span>
                            </div>
                            <div className="flex justify-between items-end pt-4">
                                <span className="text-xs uppercase tracking-[0.3em]">Total Amount</span>
                                <span className="text-2xl font-light">₹{finalTotal.toLocaleString('en-IN')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Load Official UPIGateway SDK */}
            <Script
                src="https://cdn.ekqr.in/ekqr_sdk.js"
                strategy="lazyOnload"
                onLoad={() => console.log('EKQR SDK Loaded')}
            />

            {/* UPIGateway Unified Payment Modal */}
            {paymentData && showPaymentModal && (
                <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/98 backdrop-blur-2xl animate-fadeIn"
                        onClick={() => setShowPaymentModal(false)}
                    />

                    {/* Modal Content */}
                    <div className="relative bg-[#0a0a0a] border border-white/10 w-full max-w-[460px] rounded-[3rem] shadow-[0_0_120px_rgba(0,0,0,1)] animate-modalEntrance mx-auto overflow-hidden flex flex-col max-h-[90vh]">
                        {/* Header */}
                        <div className="bg-[#111] p-6 border-b border-white/5 flex justify-between items-center shrink-0">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg transform rotate-3">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                        <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold">Secure Checkout</p>
                                    <p className="text-sm text-white font-medium tracking-tight">Order #{paymentData.data?.order_id || '...'}</p>
                                </div>
                            </div>
                            <button onClick={() => setShowPaymentModal(false)} className="text-white/30 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-xl">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                            {/* Amount Display */}
                            <div className="text-center space-y-1">
                                <p className="text-[10px] text-white/30 uppercase tracking-[0.3em] font-bold">Total Amount</p>
                                <h2 className="text-5xl font-thin tracking-tighter text-white">₹{finalTotal.toLocaleString('en-IN')}</h2>
                            </div>

                            {/* Official QR Code (Iframe Method from Docs) */}
                            <div className="relative flex flex-col items-center">
                                <div className="bg-white p-5 rounded-[2.5rem] shadow-2xl relative group">
                                    <div className="w-[240px] h-[240px] overflow-hidden rounded-2xl">
                                        <iframe
                                            src={`https://qrstuff.me/gateway/iframe_pay/${paymentData.data.session_id}`}
                                            className="w-full h-full border-0"
                                            scrolling="no"
                                            title="Official UPI QR"
                                        />
                                    </div>
                                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-black text-white text-[8px] font-black uppercase tracking-[0.25em] px-4 py-1.5 rounded-full shadow-xl border border-white/10">
                                        Scan with any UPI App
                                    </div>
                                </div>
                            </div>

                            {/* App Intent Section */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="h-px flex-1 bg-white/5" />
                                    <p className="text-[9px] text-white/20 uppercase tracking-[0.4em] font-bold">Pay via Apps</p>
                                    <div className="h-px flex-1 bg-white/5" />
                                </div>

                                <div className="grid grid-cols-5 gap-3">
                                    {[
                                        {
                                            name: 'PhonePe',
                                            color: '#5f259f',
                                            link: paymentData.data?.upi_intent?.phonepe_link,
                                            icon: (
                                                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
                                                    <path d="M19.1 7.2c-.1-.1-.3-.2-.5-.2h-1.3l-2-2c-.1-.1-.3-.2-.5-.2H9.2c-.2 0-.4.1-.5.2l-2 2H5.4c-.2 0-.4.1-.5.2-.1.1-.2.3-.2.5v11.4c0 .2.1.4.2.5.1.1.3.2.5.2h13.2c.2 0 .4-.1.5-.2.1-.1.2-.3.2-.5V7.7c0-.2-.1-.4-.2-.5z" />
                                                </svg>
                                            )
                                        },
                                        {
                                            name: 'GPay',
                                            color: '#ffffff',
                                            link: paymentData.data?.upi_intent?.gpay_link,
                                            icon: (
                                                <svg viewBox="0 0 24 24" className="w-6 h-6">
                                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                                </svg>
                                            )
                                        },
                                        {
                                            name: 'Amazon',
                                            color: '#ff9900',
                                            link: paymentData.data?.upi_intent?.amazonpay_link || paymentData.data?.upi_intent?.bhim_link,
                                            icon: (
                                                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-black">
                                                    <path d="M15.93 17.13c-1.47.81-2.94 1.22-4.41 1.22-4.05 0-6.12-2.31-6.13-4.62 0-3.07 2.52-5.06 6.35-5.06h3.69V7.61z" />
                                                </svg>
                                            )
                                        },
                                        {
                                            name: 'BHIM',
                                            color: '#0a0a0a',
                                            link: paymentData.data?.upi_intent?.bhim_link,
                                            icon: (
                                                <div className="flex flex-col items-center leading-none italic font-black text-[10px] text-white">
                                                    <span>BHIM</span>
                                                    <span className="text-[6px] opacity-60">UPI</span>
                                                </div>
                                            )
                                        },
                                        {
                                            name: 'SBI',
                                            color: '#2563eb',
                                            link: paymentData.data?.upi_intent?.bhim_link,
                                            icon: (
                                                <div className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center font-black text-[8px] text-white font-mono">
                                                    SBI
                                                </div>
                                            )
                                        }
                                    ].map((app) => (
                                        <a
                                            key={app.name}
                                            href={app.link || '#'}
                                            className={`flex flex-col items-center gap-2 group transition-all ${!app.link ? 'opacity-30 grayscale cursor-not-allowed' : 'hover:scale-110 active:scale-95'}`}
                                            onClick={(e) => {
                                                if (!app.link) e.preventDefault();
                                                console.log(`Paying via ${app.name}`);
                                            }}
                                        >
                                            <div
                                                className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg border border-white/5"
                                                style={{ backgroundColor: app.color }}
                                            >
                                                {app.icon}
                                            </div>
                                            <span className="text-[7px] text-white/40 uppercase tracking-widest font-bold group-hover:text-white transition-colors">{app.name}</span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Footer Notification */}
                        <div className="bg-white/5 p-6 border-t border-white/5 text-center shrink-0">
                            <p className="text-[9px] text-white/30 uppercase tracking-[0.2em] leading-relaxed">
                                Use official apps for secure payment<br />
                                <span className="text-white/10 mt-1 block">Managed by UPIGateway • 256-bit SSL</span>
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Initialize SDK Callbacks (Hidden) */}
            {paymentData && showPaymentModal && (
                <Script id="ekqr-init" strategy="afterInteractive">
                    {`
                        if (window.EKQR) {
                            new window.EKQR({
                                sessionId: "${paymentData.data.session_id}",
                                callbacks: {
                                    onSuccess: function(res) {
                                        window.location.href = "/order-confirmation?id=${paymentData.client_txn_id}";
                                    },
                                    onError: function(err) {
                                        console.error("Payment SDK Error:", err);
                                    }
                                }
                            });
                        }
                    `}
                </Script>
            )}

            <Footer />

            <style jsx>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes modalEntrance { from { opacity: 0; transform: scale(0.95) translateY(40px); } to { opacity: 1; transform: scale(1) translateY(0); } }
                .animate-fadeIn { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                .animate-modalEntrance { animation: modalEntrance 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
            `}</style>
        </div>

    );
}
