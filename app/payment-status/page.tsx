'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function PaymentStatusContent() {
    const searchParams = useSearchParams();
    const status = searchParams.get('status');
    const orderId = searchParams.get('orderId');
    const error = searchParams.get('error');

    const [orderDetails, setOrderDetails] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (orderId) {
            fetch(`/api/payment/check-status?orderId=${orderId}&method=phonepe`)
                .then(res => res.json())
                .then(data => {
                    setOrderDetails(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error('Error fetching order:', err);
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [orderId]);

    const isSuccess = status === 'success' || status === 'completed';
    const isPending = status === 'pending';
    const isFailed = status === 'failed' || status === 'error';

    return (
        <div className="bg-black min-h-screen text-white font-['Helvetica_Neue',Arial,sans-serif]">
            <Navbar />

            <main className="max-w-2xl mx-auto px-4 sm:px-8 pt-32 pb-20">
                <div className="bg-neutral-900/50 border border-white/10 p-8 md:p-12">
                    {/* Status Icon */}
                    <div className="mb-8 text-center">
                        {isSuccess && (
                            <div className="w-24 h-24 mx-auto bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mb-6">
                                <svg className="w-12 h-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        )}
                        {isPending && (
                            <div className="w-24 h-24 mx-auto bg-yellow-500/10 border border-yellow-500/30 rounded-full flex items-center justify-center mb-6">
                                <svg className="w-12 h-12 text-yellow-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        )}
                        {isFailed && (
                            <div className="w-24 h-24 mx-auto bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center mb-6">
                                <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                        )}

                        {/* Status Message */}
                        <h1 className="text-3xl md:text-4xl font-thin tracking-wide mb-3">
                            {isSuccess && 'Payment Successful'}
                            {isPending && 'Payment Pending'}
                            {isFailed && 'Payment Failed'}
                        </h1>

                        <p className="text-white/60 font-light">
                            {isSuccess && 'Thank you for your purchase. Your order has been confirmed.'}
                            {isPending && 'Your payment is being processed. Please wait...'}
                            {isFailed && (error ? decodeURIComponent(error) : 'Something went wrong with your payment.')}
                        </p>
                    </div>

                    {/* Order Details */}
                    {orderId && (
                        <div className="border-t border-b border-white/10 py-6 mb-8 space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">Order ID</span>
                                <span className="font-mono text-white/80">{orderId}</span>
                            </div>

                            {loading ? (
                                <div className="flex items-center justify-center py-4">
                                    <div className="w-5 h-5 border border-white/20 border-t-white rounded-full animate-spin"></div>
                                    <span className="ml-3 text-white/40 text-sm">Loading details...</span>
                                </div>
                            ) : orderDetails?.data && (
                                <>
                                    {orderDetails.data.amount && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">Amount</span>
                                            <span className="text-xl font-light">₹{(orderDetails.data.amount / 100).toLocaleString('en-IN')}</span>
                                        </div>
                                    )}
                                    {orderDetails.paymentState && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">Payment Status</span>
                                            <span className={`px-3 py-1 text-[9px] uppercase tracking-widest border ${
                                                orderDetails.paymentState === 'COMPLETED'
                                                    ? 'bg-green-500/10 text-green-400 border-green-500/30'
                                                    : orderDetails.paymentState === 'PENDING'
                                                    ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
                                                    : 'bg-red-500/10 text-red-400 border-red-500/30'
                                            }`}>
                                                {orderDetails.paymentState}
                                            </span>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="space-y-4">
                        {isSuccess && (
                            <Link
                                href="/orders"
                                className="block w-full bg-white text-black py-4 text-center text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-gray-200 transition-colors"
                            >
                                View My Orders
                            </Link>
                        )}
                        {isPending && (
                            <button
                                onClick={() => window.location.reload()}
                                className="block w-full bg-yellow-500 text-black py-4 text-center text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-yellow-400 transition-colors"
                            >
                                Check Status Again
                            </button>
                        )}
                        {isFailed && (
                            <Link
                                href="/checkout"
                                className="block w-full bg-white text-black py-4 text-center text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-gray-200 transition-colors"
                            >
                                Try Again
                            </Link>
                        )}
                        <Link
                            href="/products"
                            className="block w-full bg-white/5 border border-white/10 text-white py-4 text-center text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white/10 hover:border-white/20 transition-colors"
                        >
                            Continue Shopping
                        </Link>
                    </div>

                    {/* Help Text */}
                    {(isPending || isFailed) && (
                        <p className="text-center text-white/40 text-xs mt-8">
                            Need help? Contact us at{' '}
                            <a href="mailto:support@makers3d.in" className="text-white/60 hover:text-white underline">
                                support@makers3d.in
                            </a>
                        </p>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default function PaymentStatusPage() {
    return (
        <Suspense fallback={
            <div className="bg-black min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-white/40 text-sm">Loading...</p>
                </div>
            </div>
        }>
            <PaymentStatusContent />
        </Suspense>
    );
}
