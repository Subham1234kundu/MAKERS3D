'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';

function PaymentStatusContent() {
    const searchParams = useSearchParams();
    const status = searchParams.get('status');
    const orderId = searchParams.get('orderId');
    const error = searchParams.get('error');

    const [orderDetails, setOrderDetails] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (orderId) {
            // Fetch order details
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
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                {/* Status Icon */}
                <div className="mb-6">
                    {isSuccess && (
                        <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    )}
                    {isPending && (
                        <div className="w-20 h-20 mx-auto bg-yellow-100 rounded-full flex items-center justify-center">
                            <svg className="w-10 h-10 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    )}
                    {isFailed && (
                        <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                    )}
                </div>

                {/* Status Message */}
                <h1 className={`text-2xl font-bold mb-2 ${isSuccess ? 'text-green-600' : isPending ? 'text-yellow-600' : 'text-red-600'}`}>
                    {isSuccess && 'Payment Successful!'}
                    {isPending && 'Payment Pending'}
                    {isFailed && 'Payment Failed'}
                </h1>

                <p className="text-gray-600 mb-6">
                    {isSuccess && 'Thank you for your purchase. Your order has been confirmed.'}
                    {isPending && 'Your payment is being processed. Please wait...'}
                    {isFailed && (error || 'Something went wrong with your payment. Please try again.')}
                </p>

                {/* Order Details */}
                {orderId && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                        <p className="text-sm text-gray-500 mb-1">Order ID</p>
                        <p className="font-mono font-semibold text-gray-800">{orderId}</p>

                        {loading ? (
                            <p className="text-sm text-gray-500 mt-4">Loading order details...</p>
                        ) : orderDetails?.order && (
                            <>
                                <div className="border-t mt-4 pt-4">
                                    <p className="text-sm text-gray-500 mb-1">Amount</p>
                                    <p className="font-semibold text-gray-800">₹{orderDetails.order.amount}</p>
                                </div>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500 mb-1">Name</p>
                                    <p className="font-semibold text-gray-800">{orderDetails.order.customer_name}</p>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-3">
                    {isSuccess && (
                        <Link
                            href="/user/orders"
                            className="block w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
                        >
                            View My Orders
                        </Link>
                    )}
                    {isPending && (
                        <button
                            onClick={() => window.location.reload()}
                            className="block w-full bg-yellow-600 text-white py-3 px-4 rounded-lg hover:bg-yellow-700 transition-colors"
                        >
                            Check Status Again
                        </button>
                    )}
                    {isFailed && (
                        <Link
                            href="/checkout"
                            className="block w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Try Again
                        </Link>
                    )}
                    <Link
                        href="/"
                        className="block w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function PaymentStatusPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        }>
            <PaymentStatusContent />
        </Suspense>
    );
}
