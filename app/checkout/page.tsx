'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../providers/CartProvider';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useSession } from 'next-auth/react';

export default function CheckoutPage() {
    const { cartItems, cartTotal, clearCart } = useCart();
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login?callbackUrl=/checkout');
        }
    }, [status, router]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'phonepe' | 'cod'>('phonepe');
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
                } else if (paymentMethod === 'phonepe') {
                    // Redirect to PhonePe payment page
                    if (data.redirectUrl) {
                        localStorage.setItem('last_txn_id', data.client_txn_id);
                        localStorage.setItem('last_txn_date', new Date().toLocaleDateString('en-GB').replace(/\//g, '-'));
                        window.location.href = data.redirectUrl;
                    } else {
                        alert('Payment redirect URL not received');
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
                        <div className="border-b border-white/5 pb-6">
                            <h1 className="text-4xl md:text-6xl font-thin tracking-wider text-white mb-3">CHECKOUT</h1>
                            <p className="text-white/40 text-[10px] uppercase tracking-[0.3em] font-light">Complete your order</p>
                        </div>

                        <form onSubmit={handlePayment} className="space-y-8">
                            <div className="space-y-8">
                                {/* Form Inputs */}
                                <div className="space-y-6">
                                    <div className="group">
                                        <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 block mb-3 transition-colors group-focus-within:text-white font-light">Full Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            style={{ WebkitBoxShadow: '0 0 0 1000px black inset', WebkitTextFillColor: 'white' }}
                                            className={`w-full !bg-transparent border-b ${errors.name ? 'border-red-500' : 'border-white/20'} px-0 py-3 text-sm !text-white focus:outline-none focus:border-white transition-all font-light placeholder:text-white/20 focus:!bg-transparent active:!bg-transparent`}
                                            placeholder="John Doe"
                                        />
                                        {errors.name && <p className="text-red-500 text-[9px] mt-2 tracking-wide font-light">{errors.name}</p>}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="group">
                                            <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 block mb-3 font-light">Email Address</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                style={{ WebkitBoxShadow: '0 0 0 1000px black inset', WebkitTextFillColor: 'white' }}
                                                className={`w-full !bg-transparent border-b ${errors.email ? 'border-red-500' : 'border-white/20'} px-0 py-3 text-sm !text-white focus:outline-none focus:border-white transition-all font-light placeholder:text-white/20 focus:!bg-transparent active:!bg-transparent`}
                                                placeholder="email@example.com"
                                            />
                                            {errors.email && <p className="text-red-500 text-[9px] mt-2 tracking-wide font-light">{errors.email}</p>}
                                        </div>
                                        <div className="group">
                                            <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 block mb-3 font-light">Mobile Number</label>
                                            <input
                                                type="tel"
                                                name="mobile"
                                                value={formData.mobile}
                                                onChange={handleInputChange}
                                                style={{ WebkitBoxShadow: '0 0 0 1000px black inset', WebkitTextFillColor: 'white' }}
                                                className={`w-full !bg-transparent border-b ${errors.mobile ? 'border-red-500' : 'border-white/20'} px-0 py-3 text-sm !text-white focus:outline-none focus:border-white transition-all font-light placeholder:text-white/20 focus:!bg-transparent active:!bg-transparent`}
                                                placeholder="9876543210"
                                            />
                                            {errors.mobile && <p className="text-red-500 text-[9px] mt-2 tracking-wide font-light">{errors.mobile}</p>}
                                        </div>
                                    </div>

                                    <div className="group">
                                        <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 block mb-3 font-light">Street Address</label>
                                        <input
                                            type="text"
                                            name="street"
                                            value={formData.street}
                                            onChange={handleInputChange}
                                            style={{ WebkitBoxShadow: '0 0 0 1000px black inset', WebkitTextFillColor: 'white' }}
                                            className={`w-full !bg-transparent border-b ${errors.street ? 'border-red-500' : 'border-white/20'} px-0 py-3 text-sm !text-white focus:outline-none focus:border-white transition-all font-light placeholder:text-white/20 focus:!bg-transparent active:!bg-transparent`}
                                            placeholder="House no, Building name, Street"
                                        />
                                        {errors.street && <p className="text-red-500 text-[9px] mt-2 tracking-wide font-light">{errors.street}</p>}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="group">
                                            <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 block mb-3 font-light">City</label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                style={{ WebkitBoxShadow: '0 0 0 1000px black inset', WebkitTextFillColor: 'white' }}
                                                className={`w-full !bg-transparent border-b ${errors.city ? 'border-red-500' : 'border-white/20'} px-0 py-3 text-sm !text-white focus:outline-none focus:border-white transition-all font-light placeholder:text-white/20 focus:!bg-transparent active:!bg-transparent`}
                                                placeholder="City"
                                            />
                                            {errors.city && <p className="text-red-500 text-[9px] mt-2 tracking-wide font-light">{errors.city}</p>}
                                        </div>
                                        <div className="group">
                                            <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 block mb-3 font-light">State</label>
                                            <input
                                                type="text"
                                                name="state"
                                                value={formData.state}
                                                onChange={handleInputChange}
                                                style={{ WebkitBoxShadow: '0 0 0 1000px black inset', WebkitTextFillColor: 'white' }}
                                                className={`w-full !bg-transparent border-b ${errors.state ? 'border-red-500' : 'border-white/20'} px-0 py-3 text-sm !text-white focus:outline-none focus:border-white transition-all font-light placeholder:text-white/20 focus:!bg-transparent active:!bg-transparent`}
                                                placeholder="State"
                                            />
                                            {errors.state && <p className="text-red-500 text-[9px] mt-2 tracking-wide font-light">{errors.state}</p>}
                                        </div>
                                        <div className="group">
                                            <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 block mb-3 font-light">Pincode</label>
                                            <input
                                                type="text"
                                                name="pincode"
                                                maxLength={6}
                                                value={formData.pincode}
                                                onChange={handleInputChange}
                                                style={{ WebkitBoxShadow: '0 0 0 1000px black inset', WebkitTextFillColor: 'white' }}
                                                className={`w-full !bg-transparent border-b ${errors.pincode ? 'border-red-500' : 'border-white/20'} px-0 py-3 text-sm !text-white focus:outline-none focus:border-white transition-all font-light placeholder:text-white/20 focus:!bg-transparent active:!bg-transparent`}
                                                placeholder="400001"
                                            />
                                            {errors.pincode && <p className="text-red-500 text-[9px] mt-2 tracking-wide font-light">{errors.pincode}</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Method Selection */}
                                <div className="space-y-6 pt-8 border-t border-white/5">
                                    <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-light">Payment Method</p>
                                    <div className="grid grid-cols-1 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setPaymentMethod('phonepe')}
                                            className={`group relative overflow-hidden border transition-all duration-300 ${paymentMethod === 'phonepe' ? 'border-white bg-white/5' : 'border-white/10 hover:border-white/30'}`}
                                        >
                                            <div className="p-6 flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-5 h-5 rounded-full border-2 transition-all ${paymentMethod === 'phonepe' ? 'border-white bg-white' : 'border-white/20'}`}>
                                                        {paymentMethod === 'phonepe' && (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <div className="w-2 h-2 rounded-full bg-black"></div>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="text-left">
                                                        <p className="text-[11px] font-light tracking-[0.2em] uppercase text-white mb-1">Online Payment</p>
                                                        <p className="text-[9px] text-white/40 font-light tracking-wide">UPI • Cards • NetBanking</p>
                                                    </div>
                                                </div>
                                                <div className={`text-[9px] uppercase tracking-widest font-light transition-opacity ${paymentMethod === 'phonepe' ? 'opacity-100' : 'opacity-0'}`}>
                                                    Selected
                                                </div>
                                            </div>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setPaymentMethod('cod')}
                                            className={`group relative overflow-hidden border transition-all duration-300 ${paymentMethod === 'cod' ? 'border-white bg-white/5' : 'border-white/10 hover:border-white/30'}`}
                                        >
                                            <div className="p-6 flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-5 h-5 rounded-full border-2 transition-all ${paymentMethod === 'cod' ? 'border-white bg-white' : 'border-white/20'}`}>
                                                        {paymentMethod === 'cod' && (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <div className="w-2 h-2 rounded-full bg-black"></div>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="text-left">
                                                        <p className="text-[11px] font-light tracking-[0.2em] uppercase text-white mb-1">Cash on Delivery</p>
                                                        <p className="text-[9px] text-white/40 font-light tracking-wide">Pay when you receive</p>
                                                    </div>
                                                </div>
                                                <div className={`text-[9px] uppercase tracking-widest font-light transition-opacity ${paymentMethod === 'cod' ? 'opacity-100' : 'opacity-0'}`}>
                                                    Selected
                                                </div>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 pt-6">
                                <button
                                    type="submit"
                                    disabled={isProcessing}
                                    className="w-full bg-white text-black py-5 text-[10px] font-light uppercase tracking-[0.3em] transition-all hover:bg-neutral-100 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group relative overflow-hidden"
                                >
                                    {isProcessing ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                                            <span>PROCESSING ORDER...</span>
                                        </div>
                                    ) : (
                                        <>
                                            <span>
                                                {paymentMethod === 'phonepe'
                                                    ? `PROCEED TO PAYMENT • ₹${finalTotal.toLocaleString('en-IN')}`
                                                    : `PLACE ORDER • ₹${finalTotal.toLocaleString('en-IN')}`}
                                            </span>
                                            <svg
                                                className="w-4 h-4 transition-transform group-hover:translate-x-1"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                            </svg>
                                        </>
                                    )}
                                </button>
                                <p className="text-center text-[9px] text-white/30 tracking-[0.25em] uppercase font-light">Secure Checkout • Encrypted Transaction</p>
                            </div>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:border-l lg:border-white/5 lg:pl-12 space-y-8 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                        <div className="border-b border-white/5 pb-6">
                            <h2 className="text-2xl font-thin tracking-wider uppercase text-white">ORDER SUMMARY</h2>
                            <p className="text-white/40 text-[10px] uppercase tracking-[0.3em] font-light mt-2">{cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'}</p>
                        </div>

                        <div className="space-y-4">
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex gap-4 pb-4 border-b border-white/5 last:border-0">
                                    <div className="relative w-20 h-24 bg-neutral-900/50 border border-white/10 overflow-hidden flex-shrink-0">
                                        <img
                                            src={typeof item.images?.[0] === 'string' ? item.images[0] : (item.images?.[0]?.url || item.image)}
                                            alt={typeof item.images?.[0] === 'object' ? item.images[0].alt : (item.name || item.title || 'Product')}
                                            className="object-cover w-full h-full opacity-90"
                                        />
                                        <div className="absolute top-2 right-2 bg-white text-black text-[9px] font-light w-5 h-5 rounded-full flex items-center justify-center">
                                            {item.quantity}
                                        </div>
                                    </div>
                                    <div className="flex-1 flex flex-col justify-center">
                                        <p className="text-sm font-light tracking-wide text-white mb-1">{item.name || item.title}</p>
                                        <p className="text-[9px] text-white/40 uppercase tracking-[0.2em] font-light">{item.category}</p>
                                    </div>
                                    <div className="flex items-center">
                                        <p className="text-sm font-light text-white">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="pt-6 border-t border-white/5 space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-white/40 font-light tracking-wide">Subtotal</span>
                                <span className="font-light text-white">₹{cartTotal.toLocaleString('en-IN')}</span>
                            </div>
                            {paymentMethod === 'cod' && (
                                <div className="flex justify-between text-sm animate-fadeIn">
                                    <span className="text-white/40 font-light tracking-wide">COD Handling Fee</span>
                                    <span className="text-white/60 font-light">+ ₹{codCharge.toLocaleString('en-IN')}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-sm">
                                <span className="text-white/40 font-light tracking-wide">Shipping</span>
                                <span className="text-white font-light uppercase tracking-[0.2em] text-[10px]">Free</span>
                            </div>
                            <div className="flex justify-between items-center pt-4 border-t border-white/10">
                                <span className="text-[10px] uppercase tracking-[0.3em] text-white/60 font-light">Total</span>
                                <span className="text-3xl font-thin tracking-wider text-white">₹{finalTotal.toLocaleString('en-IN')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />

            <style jsx>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                .animate-fadeIn { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
            `}</style>
        </div>

    );
}

