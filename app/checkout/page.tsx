'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../providers/CartProvider';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useSession } from 'next-auth/react';
import UPIPaymentModal from '../components/UPIPaymentModal';

export default function CheckoutPage() {
    const { cartItems, cartTotal, clearCart } = useCart();
    const { data: session } = useSession();
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
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
                    console.log('Payment Data Received:', data);
                    console.log('Session ID:', data.data?.session_id);
                    console.log('Payment URL:', data.data?.payment_url);
                    setPaymentData(data);
                    setShowPaymentModal(true);
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

            {/* UPI Payment Modal - SDK Based */}
            <UPIPaymentModal
                isOpen={showPaymentModal && paymentData !== null}
                onClose={() => setShowPaymentModal(false)}
                sessionId={paymentData?.data?.session_id || ''}
                orderId={paymentData?.data?.order_id || paymentData?.order_id || ''}
                amount={finalTotal}
                onSuccess={(response) => {
                    console.log('Payment successful:', response);
                    setIsPaymentSuccess(true);
                    clearCart();
                    setTimeout(() => {
                        router.push(`/order-confirmation?id=${paymentData.client_txn_id}`);
                    }, 2000);
                }}
                onError={(response) => {
                    console.error('Payment error:', response);
                    alert('Payment failed. Please try again.');
                    setShowPaymentModal(false);
                }}
                onCancelled={(response) => {
                    console.log('Payment cancelled:', response);
                    setShowPaymentModal(false);
                }}
            />

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
