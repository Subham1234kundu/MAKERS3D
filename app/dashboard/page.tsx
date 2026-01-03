'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import AddProduct from '../components/AddProduct';
import DeleteProductModal from '../components/DeleteProductModal';
import OrderDetailsModal from '../components/OrderDetailsModal';

const ParticleCubeLogo = dynamic(() => import('../components/ParticleCubeLogo'), {
    ssr: false,
    loading: () => <div style={{ width: '40px', height: '40px' }} />
});

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeView, setActiveView] = useState<'overview' | 'products' | 'orders' | 'requests' | 'customers' | 'settings'>('overview');
    const [customers, setCustomers] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    const [orders, setOrders] = useState<any[]>([]);
    const [isLoadingOrders, setIsLoadingOrders] = useState(false);

    const [requests, setRequests] = useState<any[]>([]);

    useEffect(() => {
        try {
            const stored = localStorage.getItem('mock_custom_orders');
            if (stored) {
                const customOrders = JSON.parse(stored);
                if (Array.isArray(customOrders) && customOrders.length > 0) {
                    setRequests(customOrders);
                }
            }
        } catch (error) {
            console.error('Error parsing custom orders from localStorage:', error);
        }
    }, []);

    const [products, setProducts] = useState<any[]>([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const [isAddFormOpen, setIsAddFormOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<any>(null);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);

    const fetchProducts = async () => {
        setIsLoadingProducts(true);
        try {
            const res = await fetch('/api/admin/products');
            if (res.ok) {
                const data = await res.json();
                setProducts(data);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setIsLoadingProducts(false);
        }
    };

    const fetchOrders = async () => {
        setIsLoadingOrders(true);
        try {
            const res = await fetch('/api/admin/orders');
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

    const handleStatusUpdate = async (orderId: string, newStatus: string) => {
        try {
            const res = await fetch('/api/admin/orders', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId, status: newStatus })
            });

            if (res.ok) {
                setOrders(prevOrders => prevOrders.map(order =>
                    order.id === orderId ? { ...order, status: newStatus.charAt(0).toUpperCase() + newStatus.slice(1) } : order
                ));
            } else {
                alert('Failed to update status');
            }
        } catch (error) {
            console.error('Status update error:', error);
        }
    };

    const handleConfirmDelete = async () => {
        if (productToDelete) {
            try {
                const res = await fetch(`/api/admin/products?id=${productToDelete.id}`, {
                    method: 'DELETE'
                });
                if (res.ok) {
                    setProducts(products.filter(p => p.id !== productToDelete.id));
                    setProductToDelete(null);
                } else {
                    const data = await res.json();
                    alert(data.message || 'Error deleting product');
                }
            } catch (error) {
                console.error('Delete error:', error);
                alert('Connection error');
            }
        }
    };

    const handleSaveProduct = async (productData: any) => {
        try {
            const method = editingProduct ? 'PUT' : 'POST';
            const payload = editingProduct ? { ...productData, id: editingProduct.id } : productData;

            const res = await fetch('/api/admin/products', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                fetchProducts();
                setIsAddFormOpen(false);
                setEditingProduct(null);
            } else {
                const data = await res.json();
                alert(data.message || 'Error saving product');
            }
        } catch (error) {
            console.error('Save error:', error);
            alert('Connection error');
        }
    };

    const handleEditProduct = (product: any) => {
        setEditingProduct(product);
        setIsAddFormOpen(true);
    };

    useEffect(() => {
        if (activeView === 'customers' && customers.length === 0) {
            fetchCustomers();
        }
        if (activeView === 'products' && products.length === 0) {
            fetchProducts();
        }
        if (activeView === 'orders' && orders.length === 0) {
            fetchOrders();
        }
        if (activeView === 'overview') {
            fetchOrders();
            fetchCustomers();
            fetchProducts();
        }
    }, [activeView]);

    const fetchCustomers = async () => {
        try {
            const res = await fetch('/api/admin/customers');
            if (res.ok) {
                const data = await res.json();
                setCustomers(data);
            }
        } catch (error) {
            console.error('Failed to fetch customers:', error);
        }
    };

    const handleExportCSV = () => {
        const headers = ['Name', 'Email', 'Phone', 'Joined Date', 'Cart Items', 'Likes', 'Orders', 'Total Spent'];
        const csvData = customers.map(c => [
            c.name,
            c.email,
            c.phone || 'N/A',
            new Date(c.createdAt).toLocaleDateString(),
            c.cartCount || 0,
            c.likesCount || 0,
            c.totalOrders || 0,
            `₹${c.totalSpent || 0}`
        ]);

        const csvContent = [headers, ...csvData].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `customers_marketing_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const filteredCustomers = customers.filter(c =>
        c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    useEffect(() => {
        if (containerRef.current) {
            gsap.fromTo(containerRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
            );

            gsap.fromTo('.dashboard-card',
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out', delay: 0.3 }
            );
        }
    }, []);

    if (status === 'loading') return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;

    return (
        <div className="bg-black min-h-screen text-white p-8">
            <div ref={containerRef} className="max-w-7xl mx-auto">
                <header className="flex justify-between items-center mb-12 border-b border-white/10 pb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-[50px] h-[50px] relative">
                            <ParticleCubeLogo />
                        </div>
                        <div className="flex flex-col justify-center leading-none">
                            <div className="flex items-baseline gap-1">
                                <span className="text-xl font-extrabold tracking-[0.05em] uppercase text-white">MAKERS</span>
                                <span className="text-xl font-extrabold tracking-[0.05em] uppercase text-white">3D</span>
                            </div>
                            <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-white/80">STUDIO</span>
                        </div>
                        <div className="h-8 w-[1px] bg-white/20 mx-4"></div>
                        <div>
                            <h2 className="text-sm font-light tracking-wide text-white uppercase">Dashboard</h2>
                            <p className="text-[10px] text-white/40 tracking-wider">Welcome, {session?.user?.name}</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <Link href="/" className="text-[10px] uppercase tracking-[0.2em] text-white/60 hover:text-white border border-white/10 hover:border-white/40 px-6 py-3 transition-all">
                            Back to Home
                        </Link>
                    </div>
                </header>

                {/* Navigation / Actions Bar */}
                <div className="flex gap-4 mb-8 border-b border-white/10 pb-4">
                    <button
                        onClick={() => setActiveView('overview')}
                        className={`text-[10px] uppercase tracking-[0.2em] px-4 py-2 transition-all ${activeView === 'overview' ? 'text-white border-b border-white' : 'text-white/40 hover:text-white'}`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveView('products')}
                        className={`text-[10px] uppercase tracking-[0.2em] px-4 py-2 transition-all ${activeView === 'products' ? 'text-white border-b border-white' : 'text-white/40 hover:text-white'}`}
                    >
                        Products
                    </button>
                    <button
                        onClick={() => setActiveView('orders')}
                        className={`text-[10px] uppercase tracking-[0.2em] px-4 py-2 transition-all ${activeView === 'orders' ? 'text-white border-b border-white' : 'text-white/40 hover:text-white'}`}
                    >
                        Orders
                    </button>
                    <button
                        onClick={() => setActiveView('requests')}
                        className={`text-[10px] uppercase tracking-[0.2em] px-4 py-2 transition-all ${activeView === 'requests' ? 'text-white border-b border-white' : 'text-white/40 hover:text-white'}`}
                    >
                        Requests
                    </button>
                    <button
                        onClick={() => setActiveView('customers')}
                        className={`text-[10px] uppercase tracking-[0.2em] px-4 py-2 transition-all ${activeView === 'customers' ? 'text-white border-b border-white' : 'text-white/40 hover:text-white'}`}
                    >
                        Customers
                    </button>
                    <button
                        onClick={() => setActiveView('settings')}
                        className={`text-[10px] uppercase tracking-[0.2em] px-4 py-2 transition-all ${activeView === 'settings' ? 'text-white border-b border-white' : 'text-white/40 hover:text-white'}`}
                    >
                        Settings
                    </button>
                </div>

                {activeView === 'overview' && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                            {[
                                {
                                    label: 'Total Sales',
                                    value: `₹${orders.filter(o => o.rawStatus === 'success' || o.rawStatus === 'delivered').reduce((acc, o) => acc + parseInt(o.amount.replace(/[^0-9]/g, '')), 0).toLocaleString('en-IN')}`,
                                    change: '+12%'
                                },
                                { label: 'Total Orders', value: orders.length.toString(), change: '+5%' },
                                { label: 'Total Customers', value: customers.length.toString(), change: '+18%' },
                                { label: 'Pending Shipments', value: orders.filter(o => o.rawStatus === 'approved' || o.rawStatus === 'pending').length.toString(), change: '-2%' }
                            ].map((stat, i) => (
                                <div key={i} className="dashboard-card bg-neutral-900/30 border border-white/5 p-6 hover:border-white/20 transition-all">
                                    <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2">{stat.label}</h3>
                                    <div className="flex justify-between items-end">
                                        <p className="text-2xl font-light">{stat.value}</p>
                                        <span className={`text-[10px] ${stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>{stat.change}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 dashboard-card bg-neutral-900/30 border border-white/5 p-8">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-sm font-medium text-white/40 uppercase tracking-widest">Recent Activity</h3>
                                    <button className="text-[10px] uppercase tracking-widest text-white/40 hover:text-white">View All</button>
                                </div>
                                <div className="space-y-4">
                                    {orders.length === 0 ? (
                                        <div className="text-center py-6 text-[10px] uppercase tracking-widest text-white/20">No recent activity</div>
                                    ) : (
                                        orders.slice(0, 5).map((order) => (
                                            <div key={order.id} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-8 h-8 bg-white/5 rounded-full flex items-center justify-center text-[8px] text-white/40 overflow-hidden">
                                                        {order.id.slice(-4)}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-light">Order #{order.id.slice(0, 8)}...</p>
                                                        <p className="text-[10px] text-white/30">{order.date}</p>
                                                    </div>
                                                </div>
                                                <span className={`text-[10px] uppercase tracking-widest px-2 py-1 
                                                    ${order.rawStatus === 'success' || order.rawStatus === 'delivered' ? 'text-green-400 bg-green-400/10' :
                                                        order.rawStatus === 'pending' ? 'text-yellow-400 bg-yellow-400/10' :
                                                            'text-blue-400 bg-blue-400/10'}`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            <div className="dashboard-card bg-neutral-900/30 border border-white/5 p-8">
                                <h3 className="text-sm font-medium text-white/40 uppercase tracking-widest mb-6">Quick Actions</h3>
                                <div className="space-y-3">
                                    <button
                                        onClick={() => { setActiveView('products'); setIsAddFormOpen(true); }}
                                        className="w-full text-left p-3 border border-white/10 hover:bg-white/5 hover:border-white/30 text-xs uppercase tracking-widest text-white/60 hover:text-white transition-all"
                                    >
                                        Add New Product
                                    </button>
                                    <button className="w-full text-left p-3 border border-white/10 hover:bg-white/5 hover:border-white/30 text-xs uppercase tracking-widest text-white/60 hover:text-white transition-all">
                                        Manage Categories
                                    </button>
                                    <button
                                        onClick={() => router.push('/dashboard/reports')}
                                        className="w-full text-left p-3 border border-white/10 hover:bg-white/5 hover:border-white/30 text-xs uppercase tracking-widest text-white/60 hover:text-white transition-all"
                                    >
                                        View Reports
                                    </button>
                                    <button className="w-full text-left p-3 border border-white/10 hover:bg-white/5 hover:border-white/30 text-xs uppercase tracking-widest text-white/60 hover:text-white transition-all">
                                        Settings
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {activeView === 'products' && (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-thin tracking-widest">PRODUCT INVENTORY</h2>
                            <button
                                onClick={() => { setIsAddFormOpen(!isAddFormOpen); setEditingProduct(null); }}
                                className="text-[10px] uppercase tracking-[0.2em] bg-white text-black px-6 py-3 hover:bg-gray-200 transition-colors"
                            >
                                {isAddFormOpen ? 'Cancel' : '+ Add Product'}
                            </button>
                        </div>

                        {isAddFormOpen && (
                            <div className="mb-12">
                                <AddProduct
                                    initialData={editingProduct}
                                    onSubmit={handleSaveProduct}
                                    onCancel={() => { setIsAddFormOpen(false); setEditingProduct(null); }}
                                />
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map((product) => (
                                <div key={product.id} className="group relative border border-white/5 bg-neutral-900/20 p-4 hover:border-white/20 transition-all">
                                    <div className="aspect-square bg-neutral-800 mb-4 overflow-hidden relative">
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-10 backdrop-blur-[2px]" />
                                        <img src={product.images[0] || '/images/placeholder.jpg'} alt={product.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />

                                        <div className="absolute inset-0 z-20 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleEditProduct(product); }}
                                                className="w-10 h-10 flex items-center justify-center border border-white/20 bg-black/50 text-white hover:bg-white hover:text-black hover:border-white transition-all rounded-sm hover:scale-110"
                                                title="Edit Product"
                                            >
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                                                </svg>
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setProductToDelete(product); }}
                                                className="w-10 h-10 flex items-center justify-center border border-white/20 bg-black/50 text-white hover:bg-red-500 hover:text-white hover:border-red-500 transition-all rounded-sm hover:scale-110"
                                                title="Delete Product"
                                            >
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="3 6 5 6 21 6"></polyline>
                                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    <h3 className="text-sm font-light tracking-wide mb-1">{product.name}</h3>
                                    <div className="flex justify-between items-center text-[10px] uppercase tracking-wider text-white/50">
                                        <span>{product.category}</span>
                                        <div className="flex gap-2">
                                            {product.originalPrice && <span className="line-through opacity-50">₹{product.originalPrice}</span>}
                                            <span className="text-white">₹{product.price}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <DeleteProductModal
                            isOpen={!!productToDelete}
                            onClose={() => setProductToDelete(null)}
                            onConfirm={handleConfirmDelete}
                            productName={productToDelete?.name || ''}
                        />
                    </div>
                )}

                {activeView === 'orders' && (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-thin tracking-widest">ORDER MANAGEMENT</h2>
                        </div>

                        <div className="bg-neutral-900/30 border border-white/5 p-4 md:p-8">
                            {/* Mobile View (Cards) */}
                            <div className="md:hidden space-y-4">
                                {orders.map((order) => (
                                    <div
                                        key={order.id}
                                        className="bg-white/5 border border-white/5 rounded-sm overflow-hidden"
                                    >
                                        {/* Clickable Header/Body */}
                                        <div
                                            className="p-5 space-y-4 active:bg-white/10 transition-colors cursor-pointer"
                                            onClick={() => setSelectedOrder(order)}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <div className="text-sm font-light text-white font-mono mb-1">{order.id}</div>
                                                    <div className="text-xs text-white/40 uppercase tracking-widest">{order.date}</div>
                                                </div>
                                                <span className={`text-[10px] uppercase tracking-widest px-2 py-1 rounded-sm
                                                    ${order.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-500' : ''}
                                                    ${order.status === 'Pending Review' ? 'bg-orange-500/10 text-orange-500' : ''}
                                                    ${order.status === 'Approved' ? 'bg-blue-500/10 text-blue-500' : ''}
                                                    ${order.status === 'Shipped' ? 'bg-purple-500/10 text-purple-500' : ''}
                                                    ${order.status === 'Delivered' ? 'bg-green-500/10 text-green-500' : ''}
                                                `}>
                                                    {order.status}
                                                </span>
                                            </div>

                                            <div>
                                                <div className="text-lg font-light text-white mb-1">{order.product}</div>
                                                <div className="text-sm text-white/60">{order.customer}</div>
                                            </div>
                                        </div>

                                        {/* Non-Clickable Action Footer */}
                                        <div className="px-5 pb-5 pt-0">
                                            <div className="flex justify-between items-center pt-4 border-t border-white/5">
                                                <div className="text-sm font-light text-white">{order.amount}</div>
                                                <div className="relative z-50">
                                                    {(order.status === 'Pending' || order.status === 'Pending Review') && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault(); // Safety
                                                                e.stopPropagation(); // Safety
                                                                handleStatusUpdate(order.id, 'Approved');
                                                            }}
                                                            className="flex justify-center items-center gap-2 px-6 py-3 bg-blue-600 active:bg-blue-700 text-white text-[10px] uppercase tracking-widest font-bold shadow-md transition-all duration-200 rounded-sm cursor-pointer select-none active:scale-95"
                                                        >
                                                            <svg className="pointer-events-none" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                                <polyline points="20 6 9 17 4 12"></polyline>
                                                            </svg>
                                                            <span className="pointer-events-none">Approve</span>
                                                        </button>
                                                    )}
                                                    {order.status === 'Approved' && (
                                                        <button
                                                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleStatusUpdate(order.id, 'Shipped'); }}
                                                            className="px-4 py-2 text-[10px] uppercase tracking-widest bg-purple-500/10 text-purple-500 border border-purple-500/20 active:bg-purple-500 active:text-white transition-all rounded-sm cursor-pointer"
                                                        >
                                                            Mark Shipped
                                                        </button>
                                                    )}
                                                    {order.status === 'Shipped' && (
                                                        <button
                                                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleStatusUpdate(order.id, 'Delivered'); }}
                                                            className="px-4 py-2 text-[10px] uppercase tracking-widest bg-green-500/10 text-green-500 border border-green-500/20 active:bg-green-500 active:text-white transition-all rounded-sm cursor-pointer"
                                                        >
                                                            Mark Delivered
                                                        </button>
                                                    )}
                                                    {order.status === 'Delivered' && (
                                                        <span className="text-[10px] uppercase tracking-widest text-white/20">
                                                            Completed
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Desktop View (Table) */}
                            <div className="hidden md:block overflow-x-auto pb-2">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-white/10">
                                            <th className="py-4 text-[10px] uppercase tracking-widest text-white/40 font-normal">Order ID</th>
                                            <th className="py-4 text-[10px] uppercase tracking-widest text-white/40 font-normal">Customer</th>
                                            <th className="py-4 text-[10px] uppercase tracking-widest text-white/40 font-normal">Product</th>
                                            <th className="py-4 text-[10px] uppercase tracking-widest text-white/40 font-normal">Amount</th>
                                            <th className="py-4 text-[10px] uppercase tracking-widest text-white/40 font-normal">Date</th>
                                            <th className="py-4 text-[10px] uppercase tracking-widest text-white/40 font-normal">Status</th>
                                            <th className="py-4 pr-6 text-[10px] uppercase tracking-widest text-white/40 font-normal text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map((order) => (
                                            <tr
                                                key={order.id}
                                                className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                                            >
                                                <td onClick={() => setSelectedOrder(order)} className="py-4 text-sm font-light text-white font-mono cursor-pointer">{order.id}</td>
                                                <td onClick={() => setSelectedOrder(order)} className="py-4 text-sm font-light text-white cursor-pointer">{order.customer}</td>
                                                <td onClick={() => setSelectedOrder(order)} className="py-4 text-sm font-light text-white/80 cursor-pointer">{order.product}</td>
                                                <td onClick={() => setSelectedOrder(order)} className="py-4 text-sm font-light text-white/80 cursor-pointer">{order.amount}</td>
                                                <td onClick={() => setSelectedOrder(order)} className="py-4 text-[10px] text-white/40 uppercase tracking-widest cursor-pointer">{order.date}</td>
                                                <td onClick={() => setSelectedOrder(order)} className="py-4 cursor-pointer">
                                                    <span key={order.status} className={`text-[10px] uppercase tracking-widest px-2 py-1 rounded-sm
                                                        ${order.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-500' : ''}
                                                        ${order.status === 'Pending Review' ? 'bg-orange-500/10 text-orange-500' : ''}
                                                        ${order.status === 'Approved' ? 'bg-blue-500/10 text-blue-500' : ''}
                                                        ${order.status === 'Shipped' ? 'bg-purple-500/10 text-purple-500' : ''}
                                                        ${order.status === 'Delivered' ? 'bg-green-500/10 text-green-500' : ''}
                                                    `}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td
                                                    className="py-4 pr-6 text-right relative z-50"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <div className="flex justify-end items-center">
                                                        {(order.status === 'Pending' || order.status === 'Pending Review') && (
                                                            <button
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    e.stopPropagation();
                                                                    handleStatusUpdate(order.id, 'Approved');
                                                                }}
                                                                className="group flex items-center gap-2 px-5 py-2 bg-blue-600 text-white text-[10px] uppercase tracking-widest font-bold shadow-[0_0_15px_rgba(37,99,235,0.5)] hover:bg-blue-500 hover:shadow-[0_0_25px_rgba(37,99,235,0.8)] transition-all duration-300 rounded-sm cursor-pointer select-none"
                                                            >
                                                                <svg className="pointer-events-none" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                                    <polyline points="20 6 9 17 4 12"></polyline>
                                                                </svg>
                                                                <span className="pointer-events-none">Approve</span>
                                                            </button>
                                                        )}
                                                        {order.status === 'Approved' && (
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); handleStatusUpdate(order.id, 'Shipped'); }}
                                                                className="text-[10px] uppercase tracking-widest bg-purple-500/10 text-purple-500 border border-purple-500/20 hover:bg-purple-500 hover:text-white px-3 py-1 transition-all rounded-sm cursor-pointer"
                                                            >
                                                                Mark Shipped
                                                            </button>
                                                        )}
                                                        {order.status === 'Shipped' && (
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); handleStatusUpdate(order.id, 'Delivered'); }}
                                                                className="text-[10px] uppercase tracking-widest bg-green-500/10 text-green-500 border border-green-500/20 hover:bg-green-500 hover:text-white px-3 py-1 transition-all rounded-sm cursor-pointer"
                                                            >
                                                                Mark Delivered
                                                            </button>
                                                        )}
                                                        {order.status === 'Delivered' && (
                                                            <span className="text-[10px] uppercase tracking-widest text-white/20">
                                                                Completed
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <OrderDetailsModal
                            isOpen={!!selectedOrder}
                            onClose={() => setSelectedOrder(null)}
                            order={selectedOrder}
                        />
                    </div>
                )}

                {activeView === 'requests' && (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-thin tracking-widest">CUSTOM REQUESTS</h2>
                        </div>

                        <div className="bg-neutral-900/30 border border-white/5 p-8">
                            {requests.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-[10px] uppercase tracking-widest text-white/40">No new requests found</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-white/10">
                                                <th className="py-4 text-[10px] uppercase tracking-widest text-white/40 font-normal">Request ID</th>
                                                <th className="py-4 text-[10px] uppercase tracking-widest text-white/40 font-normal">Customer</th>
                                                <th className="py-4 text-[10px] uppercase tracking-widest text-white/40 font-normal">File / details</th>
                                                <th className="py-4 text-[10px] uppercase tracking-widest text-white/40 font-normal">Contact</th>
                                                <th className="py-4 text-[10px] uppercase tracking-widest text-white/40 font-normal">Date</th>
                                                <th className="py-4 text-[10px] uppercase tracking-widest text-white/40 font-normal text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {requests.map((req) => (
                                                <tr
                                                    key={req.id}
                                                    onClick={() => setSelectedOrder(req)}
                                                    className="border-b border-white/5 hover:bg-white/5 transition-colors group cursor-pointer"
                                                >
                                                    <td className="py-4 text-sm font-light text-white font-mono">{req.id}</td>
                                                    <td className="py-4 text-sm font-light text-white">
                                                        {req.customer}
                                                        <div className="text-[10px] text-white/30">{req.phone}</div>
                                                    </td>
                                                    <td className="py-4">
                                                        <span className="text-sm font-light text-white/80 block mb-1">
                                                            {req.product}
                                                        </span>
                                                        {req.product.includes('Custom:') && (
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    alert(`Downloading ${req.product.replace('Custom: ', '')}...`);
                                                                }}
                                                                className="text-[10px] uppercase tracking-widest bg-white/5 hover:bg-white/10 text-white/60 hover:text-white px-2 py-1 rounded-sm flex items-center gap-2 w-max transition-all"
                                                            >
                                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                                                    <polyline points="7 10 12 15 17 10"></polyline>
                                                                    <line x1="12" y1="15" x2="12" y2="3"></line>
                                                                </svg>
                                                                Download
                                                            </button>
                                                        )}
                                                    </td>
                                                    <td className="py-4">
                                                        <div className="flex gap-2">
                                                            {req.phone && (
                                                                <a
                                                                    href={`https://wa.me/${req.phone.replace(/\D/g, '')}`}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    onClick={(e) => e.stopPropagation()}
                                                                    className="w-8 h-8 flex items-center justify-center bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white rounded-sm transition-all"
                                                                    title="WhatsApp"
                                                                >
                                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                                                                    </svg>
                                                                </a>
                                                            )}
                                                            {req.email && (
                                                                <a
                                                                    href={`mailto:${req.email}`}
                                                                    onClick={(e) => e.stopPropagation()}
                                                                    className="w-8 h-8 flex items-center justify-center bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white rounded-sm transition-all"
                                                                    title="Email"
                                                                >
                                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                                                        <polyline points="22,6 12,13 2,6"></polyline>
                                                                    </svg>
                                                                </a>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="py-4 text-[10px] text-white/40 uppercase tracking-widest">{req.date}</td>
                                                    <td className="py-4 text-right">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); setSelectedOrder(req); }}
                                                            className="text-[10px] uppercase tracking-widest text-white/40 hover:text-white border-b border-transparent hover:border-white transition-all pb-0.5"
                                                        >
                                                            View Details
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeView === 'customers' && (
                    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
                        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
                            <h2 className="text-xl font-thin tracking-widest uppercase text-center lg:text-left">Customer Directory</h2>
                            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                                <div className="relative flex-grow lg:flex-grow-0">
                                    <input
                                        type="text"
                                        placeholder="SEARCH CUSTOMERS..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="bg-transparent border border-white/10 px-4 py-3 md:py-2 text-[10px] uppercase tracking-widest focus:outline-none focus:border-white/40 w-full lg:w-64"
                                    />
                                    <svg className="absolute right-3 top-2.5 md:top-2 text-white/30" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="11" cy="11" r="8"></circle>
                                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                    </svg>
                                </div>
                                <div className="grid grid-cols-2 gap-4 sm:flex sm:gap-4">
                                    <button
                                        onClick={handleExportCSV}
                                        className="text-[10px] uppercase tracking-[0.2em] bg-white text-black px-4 md:px-6 py-4 md:py-3 hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                            <polyline points="7 10 12 15 17 10"></polyline>
                                            <line x1="12" y1="15" x2="12" y2="3"></line>
                                        </svg>
                                        <span className="hidden xs:inline">Export CSV</span>
                                        <span className="xs:hidden">Export</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            const emails = filteredCustomers.map(c => `${c.email}${c.phone ? ' (' + c.phone + ')' : ''}`).join('\n');
                                            navigator.clipboard.writeText(emails);
                                            alert('Customer contacts copied to clipboard');
                                        }}
                                        className="text-[10px] uppercase tracking-[0.2em] border border-white/20 text-white px-4 md:px-6 py-4 md:py-3 hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                        </svg>
                                        <span className="hidden xs:inline">Copy Emails</span>
                                        <span className="xs:hidden">Copy</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="bg-neutral-900/30 border border-white/5 p-4 md:p-8">
                            <div className="overflow-x-auto -mx-4 md:mx-0">
                                <table className="w-full text-left border-collapse min-w-[1000px]">
                                    <thead>
                                        <tr className="border-b border-white/10">
                                            <th className="py-4 px-6 text-[10px] uppercase tracking-widest text-white/40 font-normal">Name</th>
                                            <th className="py-4 px-4 text-[10px] uppercase tracking-widest text-white/40 font-normal">Contact Info</th>
                                            <th className="py-4 px-4 text-[10px] uppercase tracking-widest text-white/40 font-normal text-center">Joined</th>
                                            <th className="py-4 px-4 text-[10px] uppercase tracking-widest text-white/40 font-normal text-center">Cart</th>
                                            <th className="py-4 px-4 text-[10px] uppercase tracking-widest text-white/40 font-normal text-center">Likes</th>
                                            <th className="py-4 px-4 text-[10px] uppercase tracking-widest text-white/40 font-normal text-center">Orders</th>
                                            <th className="py-4 px-4 text-[10px] uppercase tracking-widest text-white/40 font-normal text-right">Revenue</th>
                                            <th className="py-4 pr-8 text-[10px] uppercase tracking-widest text-white/40 font-normal text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {filteredCustomers.length === 0 ? (
                                            <tr>
                                                <td colSpan={9} className="py-12 text-center text-[10px] uppercase tracking-widest text-white/20">
                                                    No customers found
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredCustomers.map((customer) => (
                                                <tr key={customer.id} className="hover:bg-white/5 transition-colors group">
                                                    <td className="py-5 px-6">
                                                        <span className="text-sm font-medium text-white tracking-wide truncate max-w-[150px] md:max-w-none">{customer.name}</span>
                                                    </td>
                                                    <td className="py-5 px-4">
                                                        <div className="flex flex-col gap-1">
                                                            <span className="text-xs font-light text-white/80 lowercase truncate max-w-[180px] md:max-w-none">{customer.email}</span>
                                                            <span className="text-[9px] text-white/30 tracking-[0.2em] font-mono">{customer.phone || 'NO PHONE'}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-5 px-4 text-[10px] text-white/50 uppercase tracking-widest text-center whitespace-nowrap">
                                                        {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                                                    </td>
                                                    <td className="py-5 px-4 text-center">
                                                        <span className={`inline-flex items-center justify-center min-w-[24px] h-6 text-[10px] rounded-sm px-1.5 ${customer.cartCount > 0 ? 'bg-white text-black font-bold' : 'border border-white/10 text-white/20'}`}>
                                                            {customer.cartCount || 0}
                                                        </span>
                                                    </td>
                                                    <td className="py-5 px-4 text-center">
                                                        <span className="text-xs font-light text-white/60">
                                                            {customer.likesCount || 0}
                                                        </span>
                                                    </td>
                                                    <td className="py-5 px-4 text-center">
                                                        <span className="text-xs font-mono text-white/70">{customer.totalOrders || 0}</span>
                                                    </td>
                                                    <td className="py-5 px-4 text-right whitespace-nowrap">
                                                        <span className="text-sm font-light text-white tracking-wider">₹{customer.totalSpent?.toLocaleString() || 0}</span>
                                                    </td>
                                                    <td className="py-5 pr-8 text-right whitespace-nowrap">
                                                        <button
                                                            onClick={() => window.location.href = `mailto:${customer.email}`}
                                                            className="text-[9px] uppercase tracking-[0.2em] bg-white/5 hover:bg-white text-white/40 hover:text-black border border-white/10 hover:border-white px-3 py-1.5 transition-all"
                                                        >
                                                            Mail
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="flex justify-between items-center text-[10px] text-white/40 uppercase tracking-widest">
                            <p>Showing {filteredCustomers.length} of {customers.length} total customers</p>
                            <div className="flex gap-2">
                                <button className="px-3 py-1 border border-white/10 hover:border-white/40 disabled:opacity-20 transition-all">Prev</button>
                                <button className="px-3 py-1 border border-white/10 hover:border-white/40 disabled:opacity-20 transition-all">Next</button>
                            </div>
                        </div>
                    </div>
                )}

                {activeView === 'settings' && (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-thin tracking-widest">SETTINGS</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Profile Settings */}
                            <div className="bg-neutral-900/30 border border-white/5 p-8">
                                <h3 className="text-sm font-medium text-white/40 uppercase tracking-widest mb-6">Profile Settings</h3>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2">Display Name</label>
                                        <input
                                            type="text"
                                            defaultValue={session?.user?.name || ''}
                                            className="w-full bg-black border border-white/10 p-3 text-sm font-light text-white focus:outline-none focus:border-white/30 transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            defaultValue={session?.user?.email || ''}
                                            disabled
                                            className="w-full bg-white/5 border border-white/5 p-3 text-sm font-light text-white/50 cursor-not-allowed"
                                        />
                                    </div>
                                    <button className="text-[10px] uppercase tracking-[0.2em] bg-white text-black px-6 py-3 hover:bg-gray-200 transition-colors w-full">
                                        Update Profile
                                    </button>
                                </div>
                            </div>

                            {/* Store Preferences */}
                            <div className="bg-neutral-900/30 border border-white/5 p-8">
                                <h3 className="text-sm font-medium text-white/40 uppercase tracking-widest mb-6">Store Preferences</h3>
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                        <div>
                                            <p className="text-sm font-light text-white">Email Notifications</p>
                                            <p className="text-[10px] text-white/40 mt-1">Receive updates about new orders</p>
                                        </div>
                                        <div className="w-10 h-5 bg-green-500/20 rounded-full relative cursor-pointer">
                                            <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-green-500 rounded-full shadow-lg"></div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                        <div>
                                            <p className="text-sm font-light text-white">Public Profile</p>
                                            <p className="text-[10px] text-white/40 mt-1">Make your store visible to everyone</p>
                                        </div>
                                        <div className="w-10 h-5 bg-green-500/20 rounded-full relative cursor-pointer">
                                            <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-green-500 rounded-full shadow-lg"></div>
                                        </div>
                                    </div>
                                    <div className="pt-4">
                                        <p className="text-[10px] text-red-500 uppercase tracking-widest cursor-pointer hover:text-red-400 transition-colors">
                                            Delete Account
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
