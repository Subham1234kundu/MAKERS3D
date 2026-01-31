'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Link from 'next/link';

type Tab = 'orders' | 'addresses' | 'settings';

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<Tab>('orders');
    const [isLoading, setIsLoading] = useState(true);
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoadingOrders, setIsLoadingOrders] = useState(false);

    // Address States
    const [addresses, setAddresses] = useState<any[]>([]);
    const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
    const [addressModalOpen, setAddressModalOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<any>(null);
    const [addressForm, setAddressForm] = useState({
        type: 'Home',
        street: '',
        city: '',
        state: '',
        zip: '',
        phone: ''
    });

    // Return Flow States
    const [returnModalOpen, setReturnModalOpen] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [returnImages, setReturnImages] = useState<string[]>([]); // Storing preview URLs
    const [deleteAccountModalOpen, setDeleteAccountModalOpen] = useState(false);
    const [isDeletingAccount, setIsDeletingAccount] = useState(false);

    // Form States
    const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [profileForm, setProfileForm] = useState({ name: '', email: '' });

    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');
    const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);

    // Animation Refs
    const containerRef = useRef<HTMLDivElement>(null);
    const passwordFormRef = useRef<HTMLDivElement>(null);

    const fetchOrders = async () => {
        setIsLoadingOrders(true);
        try {
            const res = await fetch('/api/user/orders');
            if (res.ok) {
                const data = await res.json();
                setOrders(data);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setIsLoadingOrders(false);
        }
    };

    const fetchAddresses = async () => {
        setIsLoadingAddresses(true);
        try {
            const res = await fetch('/api/user/addresses');
            if (res.ok) {
                const data = await res.json();
                setAddresses(data);
            }
        } catch (error) {
            console.error('Error fetching addresses:', error);
        } finally {
            setIsLoadingAddresses(false);
        }
    };

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        } else if (status === 'authenticated') {
            setIsLoading(false);
            setProfileForm({
                name: session?.user?.name || '',
                email: session?.user?.email || ''
            });
            fetchOrders();
            fetchAddresses();
        }
    }, [status, router, session]);

    useEffect(() => {
        if (!isLoading && containerRef.current) {
            gsap.fromTo(containerRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
            );
        }
    }, [isLoading]);

    const handleUpdatePassword = async () => {
        setPasswordError('');
        setPasswordSuccess('');

        if (!passwordForm.current || !passwordForm.new || !passwordForm.confirm) {
            setPasswordError('ALL FIELDS ARE REQUIRED');
            if (passwordFormRef.current) gsap.to(passwordFormRef.current, { x: 10, duration: 0.1, yoyo: true, repeat: 5, ease: 'power2.inOut' });
            return;
        }

        if (passwordForm.new !== passwordForm.confirm) {
            setPasswordError('PASSWORDS DO NOT MATCH');
            if (passwordFormRef.current) gsap.to(passwordFormRef.current, { x: 10, duration: 0.1, yoyo: true, repeat: 5, ease: 'power2.inOut' });
            return;
        }

        if (passwordForm.new.length < 8) {
            setPasswordError('PASSWORD TOO SHORT (MIN 8 CHARS)');
            if (passwordFormRef.current) gsap.to(passwordFormRef.current, { x: 10, duration: 0.1, yoyo: true, repeat: 5, ease: 'power2.inOut' });
            return;
        }

        setIsSubmittingPassword(true);

        try {
            const res = await fetch('/api/auth/update-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentPassword: passwordForm.current,
                    newPassword: passwordForm.new
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'FAILED TO UPDATE PASSWORD');
            }

            setPasswordSuccess('PASSWORD UPDATED SUCCESSFULLY');
            setPasswordForm({ current: '', new: '', confirm: '' });

        } catch (err: any) {
            setPasswordError(err.message.toUpperCase());
            if (passwordFormRef.current) gsap.to(passwordFormRef.current, { x: 10, duration: 0.1, yoyo: true, repeat: 5, ease: 'power2.inOut' });
        } finally {
            setIsSubmittingPassword(false);
        }
    };

    const handleDeleteAccount = async () => {
        setIsDeletingAccount(true);
        try {
            const res = await fetch('/api/auth/delete-account', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Failed to delete account');
            }

            // Sign out and redirect to home
            await signOut({ callbackUrl: '/' });
        } catch (err: any) {
            alert(err.message);
            setIsDeletingAccount(false);
            setDeleteAccountModalOpen(false);
        }
    };

    const handleSaveAddress = async () => {
        try {
            const method = editingAddress ? 'PUT' : 'POST';
            const body = editingAddress
                ? { ...addressForm, _id: editingAddress._id }
                : addressForm;

            const res = await fetch('/api/user/addresses', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (res.ok) {
                await fetchAddresses(); // Refresh addresses
                setAddressModalOpen(false);
                setEditingAddress(null);
                setAddressForm({
                    type: 'Home',
                    street: '',
                    city: '',
                    state: '',
                    zip: '',
                    phone: ''
                });
            } else {
                const data = await res.json();
                alert(data.message || 'Failed to save address');
            }
        } catch (error) {
            console.error('Error saving address:', error);
            alert('Failed to save address');
        }
    };

    const handleDeleteAddress = async (addressId: string) => {
        if (!confirm('Are you sure you want to delete this address?')) return;

        try {
            const res = await fetch(`/api/user/addresses?id=${addressId}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                await fetchAddresses(); // Refresh addresses
            } else {
                const data = await res.json();
                alert(data.message || 'Failed to delete address');
            }
        } catch (error) {
            console.error('Error deleting address:', error);
            alert('Failed to delete address');
        }
    };

    const openAddAddressModal = () => {
        setEditingAddress(null);
        setAddressForm({
            type: 'Home',
            street: '',
            city: '',
            state: '',
            zip: '',
            phone: ''
        });
        setAddressModalOpen(true);
    };

    const openEditAddressModal = (address: any) => {
        setEditingAddress(address);
        setAddressForm({
            type: address.type,
            street: address.street,
            city: address.city,
            state: address.state,
            zip: address.zip,
            phone: address.phone
        });
        setAddressModalOpen(true);
    };

    const handleTabChange = (tab: Tab) => {
        if (activeTab === tab) return;

        // Fade out content
        gsap.to('.tab-content', {
            opacity: 0,
            y: 10,
            duration: 0.2,
            onComplete: () => {
                setActiveTab(tab);
                // Fade in new content
                gsap.fromTo('.tab-content',
                    { opacity: 0, y: 10 },
                    { opacity: 1, y: 0, duration: 0.4, delay: 0.1 }
                );
            }
        });
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            if (files.length + returnImages.length > 3) {
                alert('Maximum 3 images allowed');
                return;
            }
            const newImageUrls = files.map(file => URL.createObjectURL(file));
            setReturnImages(prev => [...prev, ...newImageUrls]);
        }
    };

    const removeReturnImage = (index: number) => {
        const urlToRevoke = returnImages[index];
        if (urlToRevoke?.startsWith('blob:')) {
            URL.revokeObjectURL(urlToRevoke);
        }
        setReturnImages(prev => prev.filter((_, i) => i !== index));
    };

    // Cleanup all blobs on unmount or tab change
    useEffect(() => {
        return () => {
            returnImages.forEach(img => {
                if (img?.startsWith('blob:')) {
                    URL.revokeObjectURL(img);
                }
            });
        };
    }, [returnImages]);

    if (isLoading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;

    return (
        <div className="bg-black min-h-screen text-white font-['Helvetica_Neue',Arial,sans-serif]">
            <Navbar />

            {/* Return Request Modal */}
            {returnModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-[#111] border border-white/10 w-full max-w-md p-6 md:p-8 relative">
                        <button
                            onClick={() => { setReturnModalOpen(false); setReturnImages([]); }}
                            className="absolute top-4 right-4 text-white/40 hover:text-white"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
                        </button>
                        <h3 className="text-xl font-thin tracking-wide mb-6">Request Return</h3>
                        <p className="text-white/60 text-sm font-light mb-6">
                            Please upload photos of the product to request a return. (Max 3 photos)
                        </p>

                        <div className="grid grid-cols-3 gap-4 mb-6">
                            {returnImages.map((img, i) => (
                                <div key={i} className="aspect-square relative border border-white/20">
                                    <img src={img} alt="Return Proof" className="w-full h-full object-cover" />
                                    <button
                                        onClick={() => removeReturnImage(i)}
                                        className="absolute -top-2 -right-2 bg-red-500 w-5 h-5 rounded-full flex items-center justify-center text-[10px]"
                                    >✕</button>
                                </div>
                            ))}
                            {returnImages.length < 3 && (
                                <label className="aspect-square border border-dashed border-white/20 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-colors">
                                    <span className="text-2xl text-white/40">+</span>
                                    <span className="text-[9px] uppercase tracking-widest text-white/40 mt-2">Add Photo</span>
                                    <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
                                </label>
                            )}
                        </div>

                        <div className="space-y-3">
                            <textarea
                                placeholder="Reason for return..."
                                rows={3}
                                className="w-full bg-black border border-white/20 p-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white transition-colors"
                            ></textarea>
                            <button
                                onClick={() => {
                                    // Mock Submission
                                    setReturnModalOpen(false);
                                    setReturnImages([]);
                                    alert(`Return processed for ${selectedOrderId}`);
                                }}
                                className="w-full bg-white text-black py-4 text-xs font-bold uppercase tracking-widest hover:bg-gray-200"
                            >
                                Submit Request
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Address Add/Edit Modal */}
            {addressModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
                    <div className="bg-[#111] border border-white/10 w-full max-w-md p-6 md:p-8 relative max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={() => {
                                setAddressModalOpen(false);
                                setEditingAddress(null);
                            }}
                            className="absolute top-4 right-4 text-white/40 hover:text-white"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
                        </button>

                        <h3 className="text-xl font-thin tracking-wide mb-6">
                            {editingAddress ? 'Edit Address' : 'Add New Address'}
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2">Address Type</label>
                                <select
                                    value={addressForm.type}
                                    onChange={(e) => setAddressForm({ ...addressForm, type: e.target.value })}
                                    className="w-full bg-black border border-white/20 p-3 text-sm text-white focus:outline-none focus:border-white transition-colors"
                                >
                                    <option value="Home">Home</option>
                                    <option value="Work">Work</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2">Street Address</label>
                                <input
                                    type="text"
                                    value={addressForm.street}
                                    onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                                    placeholder="123 Main Street, Apt 4B"
                                    className="w-full bg-black border border-white/20 p-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white transition-colors"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2">City</label>
                                    <input
                                        type="text"
                                        value={addressForm.city}
                                        onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                                        placeholder="Mumbai"
                                        className="w-full bg-black border border-white/20 p-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2">State</label>
                                    <input
                                        type="text"
                                        value={addressForm.state}
                                        onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                                        placeholder="Maharashtra"
                                        className="w-full bg-black border border-white/20 p-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2">ZIP Code</label>
                                    <input
                                        type="text"
                                        value={addressForm.zip}
                                        onChange={(e) => setAddressForm({ ...addressForm, zip: e.target.value })}
                                        placeholder="400001"
                                        className="w-full bg-black border border-white/20 p-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2">Phone</label>
                                    <input
                                        type="tel"
                                        value={addressForm.phone}
                                        onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                                        placeholder="+91 98765 43210"
                                        className="w-full bg-black border border-white/20 p-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white transition-colors"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleSaveAddress}
                                className="w-full bg-white text-black py-4 text-xs font-bold uppercase tracking-widest hover:bg-gray-200 transition-all mt-6"
                            >
                                {editingAddress ? 'Update Address' : 'Save Address'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Account Confirmation Modal */}
            {deleteAccountModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
                    <div className="bg-[#111] border border-red-500/20 w-full max-w-md p-6 md:p-8 relative">
                        <button
                            onClick={() => setDeleteAccountModalOpen(false)}
                            disabled={isDeletingAccount}
                            className="absolute top-4 right-4 text-white/40 hover:text-white disabled:opacity-50"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
                        </button>

                        <div className="text-center mb-6">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                                    <path d="M12 9v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-thin tracking-wide mb-2 text-white">Delete Account</h3>
                            <p className="text-[10px] uppercase tracking-[0.3em] text-red-400/60">This action cannot be undone</p>
                        </div>

                        <div className="bg-red-500/5 border border-red-500/10 p-4 mb-6">
                            <p className="text-sm text-white/70 font-light leading-relaxed mb-3">
                                Are you sure you want to permanently delete your account? This will:
                            </p>
                            <ul className="space-y-2 text-xs text-white/60">
                                <li className="flex items-start gap-2">
                                    <span className="text-red-400 mt-0.5">•</span>
                                    <span>Delete all your personal information</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-400 mt-0.5">•</span>
                                    <span>Remove your order history</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-400 mt-0.5">•</span>
                                    <span>Cancel any pending orders</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-400 mt-0.5">•</span>
                                    <span>Permanently erase your account data</span>
                                </li>
                            </ul>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={handleDeleteAccount}
                                disabled={isDeletingAccount}
                                className="w-full bg-red-500 hover:bg-red-600 text-white py-4 text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isDeletingAccount ? 'DELETING ACCOUNT...' : 'YES, DELETE MY ACCOUNT'}
                            </button>
                            <button
                                onClick={() => setDeleteAccountModalOpen(false)}
                                disabled={isDeletingAccount}
                                className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white py-4 text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-50"
                            >
                                CANCEL
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-32 pb-20">

                {/* Header Profile Section */}
                <div ref={containerRef} className="mb-16 border-b border-white/10 pb-8 flex flex-col md:flex-row items-center md:items-end justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-neutral-900 border border-white/10 flex items-center justify-center text-3xl font-thin text-white/50 overflow-hidden">
                            {session?.user?.image ? (
                                <img src={session.user.image} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                session?.user?.name?.charAt(0) || 'U'
                            )}
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-thin tracking-wide mb-1">{session?.user?.name}</h1>
                            <p className="text-white/40 text-sm tracking-wider">{session?.user?.email}</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button onClick={() => signOut({ callbackUrl: '/' })} className="text-xs uppercase tracking-[0.2em] text-white/60 hover:text-white border border-white/10 hover:border-white/40 px-6 py-3 transition-all">
                            Sign Out
                        </button>
                        <button
                            onClick={() => setDeleteAccountModalOpen(true)}
                            className="text-xs uppercase tracking-[0.2em] text-red-400/60 hover:text-red-400 border border-red-400/10 hover:border-red-400/40 px-6 py-3 transition-all"
                        >
                            Delete Account
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Sidebar Navigation */}
                    <aside className="lg:col-span-3 space-y-2">
                        {[
                            { id: 'orders', label: 'My Orders' },
                            { id: 'addresses', label: 'Addresses' },
                            { id: 'settings', label: 'Account Settings' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => handleTabChange(tab.id as Tab)}
                                className={`w-full text-left px-4 py-4 text-[11px] uppercase tracking-[0.2em] transition-all border-l-2 ${activeTab === tab.id
                                    ? 'border-white text-white bg-white/5'
                                    : 'border-transparent text-white/40 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </aside>

                    {/* Main Content Area */}
                    <div className="lg:col-span-9 tab-content min-h-[400px]">

                        {activeTab === 'orders' && (
                            <div className="space-y-6">
                                {orders.length > 0 ? (
                                    orders.map((order: any) => (
                                        <div key={order.id} className="bg-neutral-900/30 border border-white/5 p-6 md:p-8 hover:border-white/20 transition-colors group">
                                            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
                                                <div>
                                                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-1">Order ID</p>
                                                    <p className="text-lg font-light tracking-wide">{order.id}</p>
                                                </div>
                                                <div className="flex items-center gap-8">
                                                    <div>
                                                        <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-1">Date</p>
                                                        <p className="text-sm font-light text-white/80">{order.date}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-1">Total</p>
                                                        <p className="text-sm font-light text-white/80">₹{order.total.toLocaleString()}</p>
                                                    </div>
                                                    <div className={`px-3 py-1 text-[9px] uppercase tracking-widest border ${order.status === 'Delivered' ? 'border-green-500/30 text-green-400 bg-green-500/10' : 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10'
                                                        }`}>
                                                        {order.status}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">Items</p>
                                                    {order.status === 'Delivered' && !order.returnStatus && (
                                                        <button
                                                            onClick={() => { setSelectedOrderId(order.id); setReturnModalOpen(true); }}
                                                            className="text-[10px] uppercase tracking-[0.2em] text-white border border-white/20 px-4 py-2 hover:bg-white hover:text-black transition-all"
                                                        >
                                                            Return Order
                                                        </button>
                                                    )}
                                                    {order.returnStatus && (
                                                        <div className="flex items-center gap-2">
                                                            <span className={`w-2 h-2 rounded-full ${order.returnStatus === 'Approved' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                                                            <span className="text-[10px] uppercase tracking-[0.2em] text-white/60">Return {order.returnStatus}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="grid gap-4">
                                                    {order.items?.map((item: any, i: number) => (
                                                        <div key={i} className="flex items-center gap-4 bg-black/40 p-3 border border-white/5">
                                                            <div className="w-12 h-12 bg-neutral-800 relative flex-shrink-0">
                                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                            </div>
                                                            <span className="text-sm font-thin text-white/80">{item.name}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="mt-6 pt-6 border-t border-white/5 flex justify-end">
                                                <button className="text-[10px] uppercase tracking-[0.2em] text-white/60 hover:text-white border-b border-transparent hover:border-white transition-all pb-1">
                                                    View Details
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-white/40 font-light">No orders found.</p>
                                )}
                            </div>
                        )}

                        {activeTab === 'addresses' && (
                            <div>
                                <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                                    <h2 className="text-xl font-thin tracking-widest">SAVED ADDRESSES</h2>
                                    <button
                                        onClick={openAddAddressModal}
                                        className="text-[10px] uppercase tracking-[0.2em] bg-white text-black px-4 py-3 hover:bg-gray-200 transition-colors"
                                    >
                                        + Add New
                                    </button>
                                </div>

                                {isLoadingAddresses ? (
                                    <div className="text-center py-12">
                                        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
                                        <p className="text-white/40 text-sm">Loading addresses...</p>
                                    </div>
                                ) : addresses.length > 0 ? (
                                    <div className="grid gap-6">
                                        {addresses.map((addr) => (
                                            <div key={addr._id} className="relative bg-neutral-900/30 border border-white/5 p-6 md:p-8 hover:border-white/20 transition-colors">
                                                <div className="absolute top-6 right-6 flex gap-3">
                                                    <button
                                                        onClick={() => openEditAddressModal(addr)}
                                                        className="text-white/40 hover:text-white text-[10px] uppercase tracking-wider"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteAddress(addr._id)}
                                                        className="text-red-400/60 hover:text-red-400 text-[10px] uppercase tracking-wider"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                                <span className="inline-block px-2 py-1 text-[9px] uppercase tracking-widest bg-white/10 text-white/80 mb-4">{addr.type}</span>
                                                <p className="text-white font-light text-lg mb-1">{session?.user?.name}</p>
                                                <p className="text-white/60 font-thin text-sm leading-relaxed">
                                                    {addr.street}<br />
                                                    {addr.city}, {addr.state} - {addr.zip}
                                                </p>
                                                <p className="text-white/60 font-thin text-sm mt-2">Phone: {addr.phone}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
                                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-white/30">
                                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                                <circle cx="12" cy="10" r="3" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-thin mb-2">No addresses saved</h3>
                                        <p className="text-white/40 text-sm mb-8">Add your first address to get started</p>
                                        <button
                                            onClick={openAddAddressModal}
                                            className="inline-block bg-white text-black px-8 py-4 text-[10px] uppercase tracking-[0.2em] hover:bg-gray-200 transition-all"
                                        >
                                            Add Address
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <div className="max-w-2xl">
                                <h2 className="text-xl font-thin tracking-widest mb-8 border-b border-white/10 pb-4">ACCOUNT SETTINGS</h2>

                                <div className="space-y-12">
                                    {/* Profile Info Form */}
                                    <div className="space-y-6">
                                        <h3 className="text-sm font-medium text-white/40 uppercase tracking-widest">Personal Information</h3>
                                        <div className="grid gap-6">
                                            <div className="group">
                                                <label className="block text-[10px] uppercase tracking-widest text-white/30 mb-2 group-focus-within:text-white transition-colors">Full Name</label>
                                                <input
                                                    type="text"
                                                    value={profileForm.name}
                                                    onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                                                    className="w-full bg-transparent border-b border-white/20 py-2 text-white placeholder-white/10 focus:outline-none focus:border-white transition-colors"
                                                />
                                            </div>
                                            <div className="group">
                                                <label className="block text-[10px] uppercase tracking-widest text-white/30 mb-2 group-focus-within:text-white transition-colors">Email Address</label>
                                                <input
                                                    type="email"
                                                    value={profileForm.email}
                                                    disabled
                                                    className="w-full bg-transparent border-b border-white/10 py-2 text-white/50 cursor-not-allowed"
                                                />
                                            </div>
                                        </div>
                                        <button className="text-[10px] uppercase tracking-[0.2em] bg-white/10 hover:bg-white hover:text-black text-white px-6 py-3 transition-all mt-4">
                                            Save Changes
                                        </button>
                                    </div>

                                    {/* Password Change Form */}
                                    <div ref={passwordFormRef} className="space-y-6 pt-8 border-t border-white/5">
                                        <h3 className="text-sm font-medium text-white/40 uppercase tracking-widest">Change Password</h3>

                                        {/* Error/Success Display */}
                                        {passwordError && (
                                            <div className="text-[10px] tracking-widest text-red-500/80 text-center uppercase mb-4 animate-pulse">
                                                {passwordError}
                                            </div>
                                        )}
                                        {passwordSuccess && (
                                            <div className="text-[10px] tracking-widest text-green-500/80 text-center uppercase mb-4">
                                                {passwordSuccess}
                                            </div>
                                        )}

                                        <div className="space-y-4">
                                            <div className="group relative">
                                                <label className="block text-[10px] uppercase tracking-widest text-white/30 mb-2 group-focus-within:text-white transition-colors">Current Password</label>
                                                <div className="relative">
                                                    <input
                                                        type={showCurrentPassword ? "text" : "password"}
                                                        value={passwordForm.current}
                                                        onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                                                        className="w-full bg-transparent border-b border-white/20 py-2 text-white focus:outline-none focus:border-white transition-colors pr-10"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                        className="absolute right-0 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                                                    >
                                                        {showCurrentPassword ? (
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line x1="2" x2="22" y1="2" y2="22" /></svg>
                                                        ) : (
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="group relative">
                                                    <label className="block text-[10px] uppercase tracking-widest text-white/30 mb-2 group-focus-within:text-white transition-colors">New Password</label>
                                                    <div className="relative">
                                                        <input
                                                            type={showNewPassword ? "text" : "password"}
                                                            value={passwordForm.new}
                                                            onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                                                            className="w-full bg-transparent border-b border-white/20 py-2 text-white focus:outline-none focus:border-white transition-colors pr-10"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                                            className="absolute right-0 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                                                        >
                                                            {showNewPassword ? (
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line x1="2" x2="22" y1="2" y2="22" /></svg>
                                                            ) : (
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="group relative">
                                                    <label className="block text-[10px] uppercase tracking-widest text-white/30 mb-2 group-focus-within:text-white transition-colors">Confirm Password</label>
                                                    <div className="relative">
                                                        <input
                                                            type={showConfirmPassword ? "text" : "password"}
                                                            value={passwordForm.confirm}
                                                            onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                                                            className="w-full bg-transparent border-b border-white/20 py-2 text-white focus:outline-none focus:border-white transition-colors pr-10"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                            className="absolute right-0 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                                                        >
                                                            {showConfirmPassword ? (
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line x1="2" x2="22" y1="2" y2="22" /></svg>
                                                            ) : (
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleUpdatePassword}
                                            disabled={isSubmittingPassword}
                                            className="text-[10px] uppercase tracking-[0.2em] bg-white/10 hover:bg-white hover:text-black text-white px-6 py-3 transition-all mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isSubmittingPassword ? 'Updating...' : 'Update Password'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
