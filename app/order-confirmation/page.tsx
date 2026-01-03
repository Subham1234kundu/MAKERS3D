'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '../providers/CartProvider';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Link from 'next/link';

export default function OrderConfirmation() {
    const [status, setStatus] = useState<'loading' | 'success' | 'failure' | 'pending' | 'cod_success'>('loading');
    const [orderDetails, setOrderDetails] = useState<any>(null);
    const { clearCart } = useCart();
    const router = useRouter();
    const searchParams = useSearchParams();
    const checkCountRef = useRef(0);

    const checkStatus = async () => {
        const method = searchParams.get('method');
        const id = searchParams.get('id');

        if (method === 'cod') {
            setStatus('cod_success');
            setOrderDetails({
                order_id: id || 'N/A',
                payment_method: 'cod'
            });
            clearCart();
            return;
        }

        const txn_id = localStorage.getItem('last_txn_id');
        const txn_date = localStorage.getItem('last_txn_date');

        if (!txn_id || !txn_date) {
            setStatus('failure');
            return;
        }

        try {
            const res = await fetch('/api/payment/check-status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ client_txn_id: txn_id, txn_date })
            });

            const result = await res.json();

            if (result.status && result.data.status === 'success') {
                setStatus('success');
                setOrderDetails(result.data);
                clearCart();
                // Clear the txn info after success
                localStorage.removeItem('last_txn_id');
                localStorage.removeItem('last_txn_date');
            } else if (result.data?.status === 'failure') {
                setStatus('failure');
            } else {
                // Keep pending if not success/failure yet, let's retry a few times
                if (checkCountRef.current < 5) {
                    checkCountRef.current += 1;
                    setTimeout(checkStatus, 3000);
                } else {
                    setStatus('pending');
                }
            }
        } catch (error) {
            console.error('Status check error:', error);
            setStatus('failure');
        }
    };

    useEffect(() => {
        checkStatus();
    }, [searchParams]);

    return (
        <div className="bg-black min-h-screen text-white font-['Helvetica_Neue',Arial,sans-serif]">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-32 pb-20 flex flex-col items-center justify-center min-h-[70vh]">
                {status === 'loading' && (
                    <div className="space-y-6 text-center animate-pulse">
                        <div className="w-16 h-16 border-2 border-white/10 border-t-white rounded-full animate-spin mx-auto" />
                        <h1 className="text-xl font-thin tracking-[0.3em] uppercase">VERIFYING TRANSACTION...</h1>
                        <p className="text-white/40 text-[10px] tracking-widest">PLEASE DO NOT CLOSE THIS WINDOW</p>
                    </div>
                )}

                {(status === 'success' || status === 'cod_success') && (
                    <div className="space-y-8 text-center animate-fadeIn">
                        <div className="w-20 h-20 bg-white rounded-full mx-auto flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.2)]">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5">
                                <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <div className="space-y-4">
                            <h1 className="text-3xl md:text-5xl font-thin tracking-tighter">Order Confirmed</h1>
                            <p className="text-white/60 font-light tracking-wide max-w-md mx-auto">
                                {status === 'cod_success'
                                    ? "Thank you for your purchase. Your order has been placed successfully via Cash on Delivery. Please keep the exact amount ready at the time of delivery."
                                    : "Thank you for your purchase. Your payment was successful and we've started preparing your masterpiece."}
                            </p>
                        </div>

                        {orderDetails && (
                            <div className="bg-white/5 border border-white/10 p-8 rounded-2xl max-w-md mx-auto text-left space-y-4">
                                <div className="flex justify-between text-[10px] tracking-widest uppercase text-white/40">
                                    <span>{status === 'cod_success' ? 'Order ID' : 'Transaction ID'}</span>
                                    <span>{status === 'cod_success' ? 'Amount to Pay' : 'Amount Paid'}</span>
                                </div>
                                <div className="flex justify-between font-light">
                                    <span className="truncate max-w-[150px]">{status === 'cod_success' ? orderDetails.order_id : orderDetails.upi_txn_id}</span>
                                    <span>₹{Number(orderDetails.amount || 0).toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                            <Link href="/profile" className="px-10 py-4 bg-white text-black text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-gray-200 transition-all">
                                View Orders
                            </Link>
                            <Link href="/" className="px-10 py-4 border border-white/10 text-white text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-white/5 transition-all">
                                Back to Home
                            </Link>
                        </div>
                    </div>
                )}

                {status === 'failure' && (
                    <div className="space-y-8 text-center animate-fadeIn">
                        <div className="w-20 h-20 border-2 border-red-500 rounded-full mx-auto flex items-center justify-center">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5">
                                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <div className="space-y-4">
                            <h1 className="text-3xl md:text-5xl font-thin tracking-tighter">Payment Failed</h1>
                            <p className="text-white/60 font-light tracking-wide max-w-md mx-auto">
                                We couldn't verify your transaction. If money was deducted, please contact support with your Transaction ID.
                            </p>
                        </div>
                        <Link href="/checkout" className="inline-block px-12 py-5 bg-white text-black text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-gray-200 transition-all">
                            Try Again
                        </Link>
                    </div>
                )}

                {status === 'pending' && (
                    <div className="space-y-8 text-center animate-fadeIn">
                        <div className="w-20 h-20 border-2 border-yellow-500 rounded-full mx-auto flex items-center justify-center">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <div className="space-y-4">
                            <h1 className="text-3xl md:text-5xl font-thin tracking-tighter">Payment Pending</h1>
                            <p className="text-white/60 font-light tracking-wide max-w-md mx-auto">
                                Your payment is being processed by the bank. We'll update your order status as soon as we receive confirmation.
                            </p>
                        </div>
                        <Link href="/profile" className="inline-block px-12 py-5 bg-white text-black text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-gray-200 transition-all">
                            Check Status in Profile
                        </Link>
                    </div>
                )}
            </main>

            <Footer />

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.8s ease-out forwards;
                }
            `}</style>
        </div>
    );
}
