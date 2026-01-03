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
    const [paymentMethod, setPaymentMethod] = useState<'upi' | 'cod'>('upi');
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
    const [isCheckingStatus, setIsCheckingStatus] = useState(false);
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

    // Timer logic for QR
    useEffect(() => {
        if (showPaymentModal && timeLeft > 0 && !isPaymentSuccess) {
            const timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        } else if (timeLeft === 0) {
            setShowPaymentModal(false);
            alert('Payment session expired. Please try again.');
        }
    }, [showPaymentModal, timeLeft, isPaymentSuccess]);

    // Status Polling logic
    useEffect(() => {
        let pollInterval: NodeJS.Timeout;

        if (showPaymentModal && paymentData?.client_txn_id && !isPaymentSuccess) {
            pollInterval = setInterval(async () => {
                try {
                    const res = await fetch('/api/payment/check-status', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            client_txn_id: paymentData.client_txn_id,
                            txn_date: new Date().toLocaleDateString('en-GB').replace(/\//g, '-')
                        })
                    });
                    const data = await res.json();
                    if (data.status && data.data?.status === 'success') {
                        setIsPaymentSuccess(true);
                        clearCart();
                        setTimeout(() => {
                            router.push(`/order-confirmation?id=${paymentData.client_txn_id}`);
                        }, 2000);
                    }
                } catch (error) {
                    console.error('Polling error:', error);
                }
            }, 5000);
        }

        return () => clearInterval(pollInterval);
    }, [showPaymentModal, paymentData, isPaymentSuccess, router, clearCart]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

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
                    setPaymentData(data);
                    setShowPaymentModal(true);
                    setTimeLeft(300);
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

            {/* Payment Gateway Modal */}
            {showPaymentModal && paymentData && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center px-4 overflow-hidden">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/90 backdrop-blur-md animate-fadeIn"
                        onClick={() => !isPaymentSuccess && setShowPaymentModal(false)}
                    />

                    {/* Modal Content */}
                    <div className="relative bg-[#0a0a0a] border border-white/10 w-full max-w-[400px] rounded-[2rem] shadow-[0_0_80px_rgba(0,0,0,0.8)] animate-modalEntrance mx-auto max-h-[90vh] flex flex-col overflow-hidden">
                        {/* Header - Fixed to top */}
                        <div className="bg-[#111] p-5 border-b border-white/5 flex justify-between items-center shrink-0">
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
                            {!isPaymentSuccess && (
                                <button
                                    onClick={() => setShowPaymentModal(false)}
                                    className="text-white/20 hover:text-white transition-colors p-1"
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M18 6L6 18M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>

                        {/* Scrollable Body Container */}
                        <div className="overflow-y-auto flex-1 custom-scrollbar">
                            {isPaymentSuccess ? (
                                <div className="p-12 text-center space-y-6 animate-fadeIn">
                                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(34,197,94,0.4)]">
                                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    </div>
                                    <div className="space-y-2">
                                        <h2 className="text-2xl font-thin tracking-wide">PAYMENT SUCCESSFUL</h2>
                                        <p className="text-white/40 text-[10px] uppercase tracking-widest">Redirecting to confirmation...</p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {/* Amount Section & QR */}
                                    <div className="p-6 sm:p-8 pb-4 text-center space-y-6">
                                        <div className="space-y-1">
                                            <p className="text-[10px] text-white/30 uppercase tracking-[0.2em]">Total Outstanding</p>
                                            <h2 className="text-4xl sm:text-5xl font-thin tracking-tighter italic">₹{finalTotal.toLocaleString('en-IN')}</h2>
                                        </div>

                                        {/* QR Code */}
                                        <div className="space-y-4">
                                            <div className="relative group mx-auto w-48 h-48 bg-white p-4 rounded-3xl shadow-[0_0_40px_rgba(255,255,255,0.03)] transition-all">
                                                <img
                                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(paymentData.data?.payment_url || '')}`}
                                                    alt="Payment QR"
                                                    className="w-full h-full object-contain"
                                                />
                                                <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                            <div className="flex flex-col items-center gap-1">
                                                <p className="text-[9px] text-white/20 uppercase tracking-[0.4em] font-medium">Scan to pay within</p>
                                                <p className="text-xl font-mono text-white/80 tabular-nums">{formatTime(timeLeft)}</p>
                                            </div>
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
                                </>
                            )}
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
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
            `}</style>
        </div>

    );
}
