'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';

interface UPIPaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    sessionId: string;
    orderId: string;
    amount: number;
    onSuccess: (response: any) => void;
    onError: (response: any) => void;
    onCancelled: (response: any) => void;
}

declare global {
    interface Window {
        EKQR: any;
    }
}

export default function UPIPaymentModal({
    isOpen,
    onClose,
    sessionId,
    orderId,
    amount,
    onSuccess,
    onError,
    onCancelled
}: UPIPaymentModalProps) {
    const [sdkLoaded, setSdkLoaded] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const paymentContainerRef = useRef<HTMLDivElement>(null);
    const sdkInstanceRef = useRef<any>(null);

    useEffect(() => {
        if (sdkLoaded && isOpen && sessionId && !isInitialized) {
            initializeSDK();
        }
    }, [sdkLoaded, isOpen, sessionId, isInitialized]);

    const initializeSDK = () => {
        try {
            if (!window.EKQR) {
                console.error('EKQR SDK not loaded');
                return;
            }

            console.log('Initializing EKQR SDK with session:', sessionId);

            // Create SDK instance
            const paymentSDK = new window.EKQR({
                sessionId: sessionId,
                callbacks: {
                    onSuccess: (response: any) => {
                        console.log('Payment Successful:', response);
                        onSuccess(response);
                    },
                    onError: (response: any) => {
                        console.error('Payment Error:', response);
                        onError(response);
                    },
                    onCancelled: (response: any) => {
                        console.info('Payment Cancelled:', response);
                        onCancelled(response);
                    }
                }
            });

            sdkInstanceRef.current = paymentSDK;
            setIsInitialized(true);

            // Trigger payment - this will open the payment interface
            setTimeout(() => {
                paymentSDK.pay();
            }, 500);

        } catch (error) {
            console.error('SDK Initialization Error:', error);
            onError({ error: 'Failed to initialize payment SDK' });
        }
    };

    const handleClose = () => {
        if (sdkInstanceRef.current) {
            // Clean up SDK instance if needed
            sdkInstanceRef.current = null;
        }
        setIsInitialized(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Load UPIGateway SDK */}
            <Script
                src="https://cdn.ekqr.in/ekqr_sdk.js"
                onLoad={() => {
                    console.log('EKQR SDK loaded successfully');
                    setSdkLoaded(true);
                }}
                onError={(e) => {
                    console.error('Failed to load EKQR SDK:', e);
                }}
            />

            {/* Modal Overlay */}
            <div className="fixed inset-0 z-[10000] flex items-center justify-center px-4 overflow-hidden">
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-black/95 backdrop-blur-xl animate-fadeIn"
                    onClick={handleClose}
                />

                {/* Modal Content */}
                <div className="relative bg-[#0a0a0a] border border-white/10 w-full max-w-[500px] rounded-3xl shadow-[0_0_100px_rgba(0,0,0,0.9)] animate-modalEntrance mx-auto max-h-[90vh] flex flex-col overflow-hidden">
                    {/* Header */}
                    <div className="bg-[#111] p-6 border-b border-white/5 flex justify-between items-center shrink-0">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold">Secure Payment Gateway</p>
                                <p className="text-sm text-white font-medium tracking-tight">Order #{orderId}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            className="text-white/30 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Payment Container */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <div className="p-8 space-y-6">
                            {/* Amount Display */}
                            <div className="text-center space-y-2 pb-6 border-b border-white/5">
                                <p className="text-[10px] text-white/30 uppercase tracking-[0.3em] font-bold">Total Amount</p>
                                <h2 className="text-5xl font-thin tracking-tighter text-white">₹{amount.toLocaleString('en-IN')}</h2>
                            </div>

                            {/* SDK Loading State */}
                            {!sdkLoaded && (
                                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                                    <div className="w-16 h-16 border-4 border-white/10 border-t-white rounded-full animate-spin" />
                                    <p className="text-sm text-white/40 uppercase tracking-widest">Loading Payment Gateway...</p>
                                </div>
                            )}

                            {/* Payment Interface Container */}
                            <div
                                ref={paymentContainerRef}
                                id="upi-payment-container"
                                className="min-h-[300px] flex items-center justify-center"
                            >
                                {sdkLoaded && !isInitialized && (
                                    <div className="flex flex-col items-center space-y-4">
                                        <div className="w-12 h-12 border-3 border-white/20 border-t-white rounded-full animate-spin" />
                                        <p className="text-xs text-white/40 uppercase tracking-widest">Initializing Payment...</p>
                                    </div>
                                )}
                            </div>

                            {/* Payment Instructions */}
                            <div className="space-y-4 pt-6 border-t border-white/5">
                                <p className="text-[9px] text-white/20 uppercase tracking-[0.3em] font-bold text-center">Payment Instructions</p>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <span className="text-[10px] text-white/40 font-bold">1</span>
                                        </div>
                                        <p className="text-[11px] text-white/40 leading-relaxed">Scan the QR code with any UPI app (GPay, PhonePe, Paytm, etc.)</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <span className="text-[10px] text-white/40 font-bold">2</span>
                                        </div>
                                        <p className="text-[11px] text-white/40 leading-relaxed">Complete the payment in your UPI app</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <span className="text-[10px] text-white/40 font-bold">3</span>
                                        </div>
                                        <p className="text-[11px] text-white/40 leading-relaxed">Wait for confirmation - do not close this window</p>
                                    </div>
                                </div>
                            </div>

                            {/* Security Badge */}
                            <div className="flex items-center justify-center gap-2 pt-4">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                </svg>
                                <p className="text-[8px] text-white/20 uppercase tracking-[0.4em] font-bold">256-bit Encrypted</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes modalEntrance {
                    from { opacity: 0; transform: scale(0.95) translateY(20px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out forwards;
                }
                .animate-modalEntrance {
                    animation: modalEntrance 0.4s cubic-bezier(0.19, 1, 0.22, 1) forwards;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
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
        </>
    );
}
