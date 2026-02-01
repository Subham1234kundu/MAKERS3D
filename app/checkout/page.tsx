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

    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false);
    const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);

    const [errors, setErrors] = useState<Record<string, string>>({});

    const codCharge = paymentMethod === 'cod' ? Math.round(cartTotal * 0.1) : 0;
    const finalTotal = cartTotal + codCharge;

    useEffect(() => {
        if (!cartItems.length) {
            router.push('/cart');
        }
    }, [cartItems, router]);



    const fetchAddressSuggestions = async (query: string) => {
        if (!query.trim() || query.length < 3) {
            setSuggestions([]);
            return;
        }

        setIsFetchingSuggestions(true);
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=in&addressdetails=1&limit=5&extratags=1`
            );
            const data = await response.json();
            setSuggestions(data);
        } catch (error) {
            console.error('Error fetching address suggestions:', error);
        } finally {
            setIsFetchingSuggestions(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Address Autocomplete logic
        if (name === 'street') {
            if (debounceTimeout) clearTimeout(debounceTimeout);
            const timeout = setTimeout(() => {
                fetchAddressSuggestions(value);
            }, 600);
            setDebounceTimeout(timeout);
        }

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const selectSuggestion = (suggestion: any) => {
        const { address } = suggestion;

        // Build a detailed street address from specific components if available
        const streetParts = [];
        if (address.house_number) streetParts.push(address.house_number);
        if (address.building) streetParts.push(address.building);
        if (address.residential) streetParts.push(address.residential);
        if (address.road) streetParts.push(address.road);
        if (address.neighbourhood) streetParts.push(address.neighbourhood);
        if (address.suburb && !streetParts.includes(address.suburb)) streetParts.push(address.suburb);

        const streetValue = streetParts.length >= 2
            ? streetParts.join(', ')
            : suggestion.display_name.split(',').slice(0, 3).join(', ').trim();

        setFormData(prev => ({
            ...prev,
            street: streetValue,
            city: address.city || address.town || address.village || address.suburb || address.county || '',
            state: address.state || '',
            pincode: address.postcode?.replace(/\s/g, '').match(/\d{6}/)?.[0] || prev.pincode
        }));
        setSuggestions([]);
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
                    <div className="space-y-12 animate-fadeIn">
                        <div className="border-b border-white/5 pb-8">
                            <h1 className="text-4xl md:text-6xl font-thin tracking-[0.1em] text-white mb-4">CHECKOUT</h1>
                            <div className="flex items-center gap-3">
                                <div className="h-[1px] w-8 bg-white/20"></div>
                                <p className="text-white/40 text-[10px] uppercase tracking-[0.4em] font-light">Complete your details</p>
                            </div>
                        </div>

                        <form onSubmit={handlePayment} className="space-y-12">
                            <div className="space-y-10">
                                {/* Form Inputs Section */}
                                <div className="space-y-8">
                                    <div className="group">
                                        <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 block mb-3 transition-colors group-focus-within:text-white font-light">Full Name</label>
                                        <div className="relative overflow-hidden">
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                style={{ WebkitBoxShadow: '0 0 0 1000px #080808 inset' }}
                                                className={`checkout-input w-full bg-[#080808] border ${errors.name ? 'border-red-500/50' : 'border-white/10'} px-5 py-4 text-sm !text-white focus:outline-none focus:border-white/40 transition-all font-light active:bg-[#080808] focus:bg-[#0c0c0c]`}
                                                placeholder="Enter your full name"
                                            />
                                            <div className={`absolute bottom-0 left-0 h-[1px] bg-white/60 transition-all duration-500 ${errors.name ? 'w-full bg-red-500' : 'w-0 group-focus-within:w-full'}`}></div>
                                        </div>
                                        {errors.name && <p className="text-red-500 text-[9px] mt-2 tracking-wide font-light">{errors.name}</p>}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="group">
                                            <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 block mb-3 font-light">Email Address</label>
                                            <div className="relative overflow-hidden">
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    style={{ WebkitBoxShadow: '0 0 0 1000px #080808 inset' }}
                                                    className={`checkout-input w-full bg-[#080808] border ${errors.email ? 'border-red-500/50' : 'border-white/10'} px-5 py-4 text-sm !text-white focus:outline-none focus:border-white/40 transition-all font-light active:bg-[#080808] focus:bg-[#0c0c0c]`}
                                                    placeholder="email@example.com"
                                                />
                                                <div className={`absolute bottom-0 left-0 h-[1px] bg-white/60 transition-all duration-500 ${errors.email ? 'w-full bg-red-500' : 'w-0 group-focus-within:w-full'}`}></div>
                                            </div>
                                            {errors.email && <p className="text-red-500 text-[9px] mt-2 tracking-wide font-light">{errors.email}</p>}
                                        </div>
                                        <div className="group">
                                            <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 block mb-3 font-light">Mobile Number</label>
                                            <div className="relative overflow-hidden">
                                                <input
                                                    type="tel"
                                                    name="mobile"
                                                    value={formData.mobile}
                                                    onChange={handleInputChange}
                                                    style={{ WebkitBoxShadow: '0 0 0 1000px #080808 inset' }}
                                                    className={`checkout-input w-full bg-[#080808] border ${errors.mobile ? 'border-red-500/50' : 'border-white/10'} px-5 py-4 text-sm !text-white focus:outline-none focus:border-white/40 transition-all font-light active:bg-[#080808] focus:bg-[#0c0c0c]`}
                                                    placeholder="9876543210"
                                                />
                                                <div className={`absolute bottom-0 left-0 h-[1px] bg-white/60 transition-all duration-500 ${errors.mobile ? 'w-full bg-red-500' : 'w-0 group-focus-within:w-full'}`}></div>
                                            </div>
                                            {errors.mobile && <p className="text-red-500 text-[9px] mt-2 tracking-wide font-light">{errors.mobile}</p>}
                                        </div>
                                    </div>

                                    <div className="group relative">
                                        <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 block mb-3 font-light">Street Address</label>
                                        <div className="relative overflow-hidden">
                                            <input
                                                type="text"
                                                name="street"
                                                value={formData.street}
                                                onChange={handleInputChange}
                                                onFocus={() => formData.street.length >= 3 && fetchAddressSuggestions(formData.street)}
                                                autoComplete="off"
                                                style={{ WebkitBoxShadow: '0 0 0 1000px #080808 inset' }}
                                                className={`checkout-input w-full bg-[#080808] border ${errors.street ? 'border-red-500/50' : 'border-white/10'} px-5 py-4 text-sm !text-white focus:outline-none focus:border-white/40 transition-all font-light active:bg-[#080808] focus:bg-[#0c0c0c]`}
                                                placeholder="House no, Building name, Street"
                                            />
                                            <div className={`absolute bottom-0 left-0 h-[1px] bg-white/60 transition-all duration-500 ${errors.street ? 'w-full bg-red-500' : 'w-0 group-focus-within:w-full'}`}></div>
                                        </div>

                                        {/* Suggestions Dropdown */}
                                        {suggestions.length > 0 && (
                                            <div className="absolute z-50 left-0 right-0 mt-1 bg-[#0c0c0c] border border-white/10 shadow-2xl overflow-hidden animate-fadeIn backdrop-blur-xl">
                                                {suggestions.map((s, i) => (
                                                    <button
                                                        key={i}
                                                        type="button"
                                                        onClick={() => selectSuggestion(s)}
                                                        className="w-full text-left px-5 py-4 hover:bg-white/[0.03] transition-colors border-b border-white/5 last:border-0 group/item"
                                                    >
                                                        <p className="text-xs font-light text-white/90 mb-1 truncate transition-colors group-hover/item:text-white">{s.display_name}</p>
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-1 h-1 rounded-full bg-white/20"></div>
                                                            <p className="text-[9px] text-white/30 uppercase tracking-[0.2em] font-light">
                                                                {[
                                                                    s.address.residential,
                                                                    s.address.suburb,
                                                                    s.address.neighbourhood,
                                                                    s.address.city_district
                                                                ].filter(Boolean).slice(0, 2).join(' • ') || s.address.city || ''}
                                                            </p>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        )}

                                        {isFetchingSuggestions && (
                                            <div className="absolute right-4 top-[52px]">
                                                <div className="w-4 h-4 border-2 border-white/10 border-t-white/40 rounded-full animate-spin"></div>
                                            </div>
                                        )}

                                        {errors.street && <p className="text-red-500 text-[9px] mt-2 tracking-wide font-light">{errors.street}</p>}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                        <div className="group">
                                            <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 block mb-3 font-light">City</label>
                                            <div className="relative overflow-hidden">
                                                <input
                                                    type="text"
                                                    name="city"
                                                    value={formData.city}
                                                    onChange={handleInputChange}
                                                    style={{ WebkitBoxShadow: '0 0 0 1000px #080808 inset' }}
                                                    className={`checkout-input w-full bg-[#080808] border ${errors.city ? 'border-red-500/50' : 'border-white/10'} px-5 py-4 text-sm !text-white focus:outline-none focus:border-white/40 transition-all font-light active:bg-[#080808] focus:bg-[#0c0c0c]`}
                                                    placeholder="City"
                                                />
                                                <div className={`absolute bottom-0 left-0 h-[1px] bg-white/60 transition-all duration-500 ${errors.city ? 'w-full bg-red-500' : 'w-0 group-focus-within:w-full'}`}></div>
                                            </div>
                                            {errors.city && <p className="text-red-500 text-[9px] mt-2 tracking-wide font-light">{errors.city}</p>}
                                        </div>
                                        <div className="group">
                                            <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 block mb-3 font-light">State</label>
                                            <div className="relative overflow-hidden">
                                                <input
                                                    type="text"
                                                    name="state"
                                                    value={formData.state}
                                                    onChange={handleInputChange}
                                                    style={{ WebkitBoxShadow: '0 0 0 1000px #080808 inset' }}
                                                    className={`checkout-input w-full bg-[#080808] border ${errors.state ? 'border-red-500/50' : 'border-white/10'} px-5 py-4 text-sm !text-white focus:outline-none focus:border-white/40 transition-all font-light active:bg-[#080808] focus:bg-[#0c0c0c]`}
                                                    placeholder="State"
                                                />
                                                <div className={`absolute bottom-0 left-0 h-[1px] bg-white/60 transition-all duration-500 ${errors.state ? 'w-full bg-red-500' : 'w-0 group-focus-within:w-full'}`}></div>
                                            </div>
                                            {errors.state && <p className="text-red-500 text-[9px] mt-2 tracking-wide font-light">{errors.state}</p>}
                                        </div>
                                        <div className="group">
                                            <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 block mb-3 font-light">Pincode</label>
                                            <div className="relative overflow-hidden">
                                                <input
                                                    type="text"
                                                    name="pincode"
                                                    maxLength={6}
                                                    value={formData.pincode}
                                                    onChange={handleInputChange}
                                                    style={{ WebkitBoxShadow: '0 0 0 1000px #080808 inset' }}
                                                    className={`checkout-input w-full bg-[#080808] border ${errors.pincode ? 'border-red-500/50' : 'border-white/10'} px-5 py-4 text-sm !text-white focus:outline-none focus:border-white/40 transition-all font-light active:bg-[#080808] focus:bg-[#0c0c0c]`}
                                                    placeholder="400001"
                                                />
                                                <div className={`absolute bottom-0 left-0 h-[1px] bg-white/60 transition-all duration-500 ${errors.pincode ? 'w-full bg-red-500' : 'w-0 group-focus-within:w-full'}`}></div>
                                            </div>
                                            {errors.pincode && <p className="text-red-500 text-[9px] mt-2 tracking-wide font-light">{errors.pincode}</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Method Selection */}
                                <div className="space-y-6 pt-10 border-t border-white/5">
                                    <div className="flex items-center gap-4 mb-2">
                                        <p className="text-[10px] uppercase tracking-[0.4em] text-white/40 font-light">Payment Method</p>
                                        <div className="flex-1 h-[1px] bg-white/5"></div>
                                    </div>
                                    <div className="grid grid-cols-1 gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setPaymentMethod('phonepe')}
                                            className={`group relative overflow-hidden border transition-all duration-500 ${paymentMethod === 'phonepe' ? 'border-white/40 bg-white/[0.03]' : 'border-white/5 hover:border-white/20 hover:bg-white/[0.01]'}`}
                                        >
                                            <div className="p-6 flex items-center justify-between">
                                                <div className="flex items-center gap-5">
                                                    <div className={`w-5 h-5 rounded-full border transition-all duration-500 flex items-center justify-center ${paymentMethod === 'phonepe' ? 'border-white bg-white' : 'border-white/20'}`}>
                                                        {paymentMethod === 'phonepe' && <div className="w-2 h-2 rounded-full bg-black"></div>}
                                                    </div>
                                                    <div className="text-left">
                                                        <p className="text-[11px] font-light tracking-[0.2em] uppercase text-white mb-1">Online Payment</p>
                                                        <p className="text-[9px] text-white/30 font-light tracking-wide">UPI • Cards • NetBanking</p>
                                                    </div>
                                                </div>
                                                <div className={`text-[9px] uppercase tracking-[0.2em] font-light transition-all duration-500 ${paymentMethod === 'phonepe' ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                                                    Selected
                                                </div>
                                            </div>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setPaymentMethod('cod')}
                                            className={`group relative overflow-hidden border transition-all duration-500 ${paymentMethod === 'cod' ? 'border-white/40 bg-white/[0.03]' : 'border-white/5 hover:border-white/20 hover:bg-white/[0.01]'}`}
                                        >
                                            <div className="p-6 flex items-center justify-between">
                                                <div className="flex items-center gap-5">
                                                    <div className={`w-5 h-5 rounded-full border transition-all duration-500 flex items-center justify-center ${paymentMethod === 'cod' ? 'border-white bg-white' : 'border-white/20'}`}>
                                                        {paymentMethod === 'cod' && <div className="w-2 h-2 rounded-full bg-black"></div>}
                                                    </div>
                                                    <div className="text-left">
                                                        <p className="text-[11px] font-light tracking-[0.2em] uppercase text-white mb-1">Cash on Delivery</p>
                                                        <p className="text-[9px] text-white/30 font-light tracking-wide">Pay when you receive</p>
                                                    </div>
                                                </div>
                                                <div className={`text-[9px] uppercase tracking-[0.2em] font-light transition-all duration-500 ${paymentMethod === 'cod' ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                                                    Selected
                                                </div>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6 pt-6">
                                <button
                                    type="submit"
                                    disabled={isProcessing}
                                    className="w-full bg-white text-black py-6 text-[10px] font-light uppercase tracking-[0.4em] transition-all hover:bg-neutral-100 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group relative overflow-hidden"
                                >
                                    {isProcessing ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                                            <span>PROCESSING...</span>
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
                                <p className="text-center text-[9px] text-white/20 tracking-[0.3em] uppercase font-light">Secure Checkout • Encrypted Transaction</p>
                            </div>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:border-l lg:border-white/5 lg:pl-12 space-y-12 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                        <div className="border-b border-white/5 pb-8">
                            <h2 className="text-2xl font-thin tracking-[0.1em] uppercase text-white">ORDER SUMMARY</h2>
                            <p className="text-white/40 text-[10px] uppercase tracking-[0.4em] font-light mt-4">
                                {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'} in bag
                            </p>
                        </div>

                        <div className="space-y-6 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex gap-6 pb-6 border-b border-white/5 last:border-0 last:pb-0">
                                    <div className="relative w-20 h-24 bg-neutral-900/30 border border-white/5 overflow-hidden flex-shrink-0">
                                        <img
                                            src={typeof item.images?.[0] === 'string' ? item.images[0] : (item.images?.[0]?.url || item.image)}
                                            alt={typeof item.images?.[0] === 'object' ? item.images[0].alt : (item.name || item.title || 'Product')}
                                            className="object-cover w-full h-full opacity-80"
                                        />
                                        <div className="absolute top-2 right-2 bg-white text-black text-[9px] font-medium w-5 h-5 rounded-full flex items-center justify-center">
                                            {item.quantity}
                                        </div>
                                    </div>
                                    <div className="flex-1 flex flex-col justify-center">
                                        <p className="text-sm font-light tracking-wide text-white mb-2">{item.name || item.title}</p>
                                        <p className="text-[9px] text-white/30 uppercase tracking-[0.2em] font-light">{item.category}</p>
                                    </div>
                                    <div className="flex items-center">
                                        <p className="text-sm font-light text-white">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="pt-8 border-t border-white/5 space-y-4">
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
                            <div className="flex justify-between items-center pt-6 border-t border-white/10">
                                <span className="text-[10px] uppercase tracking-[0.4em] text-white/50 font-light">Total Amount</span>
                                <span className="text-3xl font-thin tracking-wider text-white">₹{finalTotal.toLocaleString('en-IN')}</span>
                            </div>
                        </div>

                        <div className="bg-white/[0.02] border border-white/5 p-6 space-y-4">
                            <p className="text-[9px] text-white/40 tracking-[0.2em] uppercase font-light leading-relaxed">
                                By placing your order, you agree to MAKERS3D's Terms of Service and Privacy Policy. All prices include applicable taxes.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />

            <style jsx global>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                .animate-fadeIn { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #080808;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #333;
                    border-radius: 20px;
                    border: 1px solid #080808;
                }
                .checkout-input::placeholder {
                    color: #999999 !important;
                    opacity: 1 !important;
                    -webkit-text-fill-color: #999999 !important;
                }
                .checkout-input::-webkit-input-placeholder {
                    color: #999999 !important;
                    opacity: 1 !important;
                    -webkit-text-fill-color: #999999 !important;
                }
                .checkout-input::-moz-placeholder {
                    color: #999999 !important;
                    opacity: 1 !important;
                }
                .checkout-input:-ms-input-placeholder {
                    color: #999999 !important;
                    opacity: 1 !important;
                }
            `}</style>
        </div>
    );
}
