'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';

interface UPIPaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    paymentData: any;
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
    paymentData,
    amount,
    onSuccess,
    onError,
    onCancelled
}: UPIPaymentModalProps) {
    const [sdkLoaded, setSdkLoaded] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const paymentContainerRef = useRef<HTMLDivElement>(null);
    const sdkInstanceRef = useRef<any>(null);

    const sessionId = paymentData?.data?.session_id || '';
    const orderId = paymentData?.data?.order_id || paymentData?.order_id || '';
    const upiIntent = paymentData?.data?.upi_intent || {};

    useEffect(() => {
        if (sdkLoaded && isOpen && sessionId && !isInitialized) {
            initializeSDK();
        }
    }, [sdkLoaded, isOpen, sessionId, isInitialized]);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            // Check if the message is from our expected origin
            if (event.origin !== 'https://qrstuff.me' && event.origin !== 'https://merchant.upigateway.com') {
                return;
            }

            const data = event.data;
            if (data && data.status) {
                if (data.status === 'success') {
                    onSuccess(data);
                } else if (data.status === 'failure' || data.status === 'error') {
                    onError(data);
                } else if (data.status === 'cancelled') {
                    onCancelled(data);
                }
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [onSuccess, onError, onCancelled]);

    const initializeSDK = () => {
        try {
            if (!window.EKQR) {
                console.error('EKQR SDK not loaded');
                return;
            }

            console.log('Initializing EKQR SDK with session:', sessionId);

            // Create SDK instance just to handle internal logic if needed, 
            // but we won't call .pay() because it opens a duplicate modal.
            const paymentSDK = new window.EKQR({
                sessionId: sessionId,
                callbacks: {
                    onSuccess: (response: any) => {
                        console.log('SDK Success callback:', response);
                        onSuccess(response);
                    },
                    onError: (response: any) => {
                        console.error('SDK Error callback:', response);
                        onError(response);
                    },
                    onCancelled: (response: any) => {
                        console.info('SDK Cancelled callback:', response);
                        onCancelled(response);
                    }
                }
            });

            sdkInstanceRef.current = paymentSDK;
            setIsInitialized(true);

            // We DO NOT call paymentSDK.pay() here to avoid the double modal issue.
            // Instead we render our own interface using the session details.

        } catch (error) {
            console.error('SDK Initialization Error:', error);
            // We can still proceed with our manual iframe even if SDK init fails
            setIsInitialized(true);
        }
    };

    const handleClose = () => {
        setIsInitialized(false);
        onClose();
    };

    if (!isOpen) return null;

    const upiApps = [
        {
            name: 'PhonePe',
            color: '#5f259f',
            link: upiIntent.phonepe_link,
            icon: (
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
                    <path d="M19.1 7.2c-.1-.1-.3-.2-.5-.2h-1.3l-2-2c-.1-.1-.3-.2-.5-.2H9.2c-.2 0-.4.1-.5.2l-2 2H5.4c-.2 0-.4.1-.5.2-.1.1-.2.3-.2.5v11.4c0 .2.1.4.2.5.1.1.3.2.5.2h13.2c.2 0 .4-.1.5-.2.1-.1.2-.3.2-.5V7.7c0-.2-.1-.4-.2-.5zm-7.1 11.1c-2.4 0-4.4-2-4.4-4.4s2-4.4 4.4-4.4 4.4 2 4.4 4.4-2 4.4-4.4 4.4zm0-7.3c-1.6 0-2.9 1.3-2.9 2.9s1.3 2.9 2.9 2.9 2.9-1.3 2.9-2.9-1.3-2.9-2.9-2.9z" />
                </svg>
            )
        },
        {
            name: 'GPay',
            color: '#ffffff',
            link: upiIntent.gpay_link,
            icon: (
                <svg viewBox="0 0 24 24" className="w-6 h-6">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
            )
        },
        {
            name: 'Paytm',
            color: '#00baf2',
            link: upiIntent.paytm_link,
            icon: (
                <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white">
                    <path d="M1.3 11.1h1.3v4.6c0 1.9 1.5 3.5 3.4 3.5s3.4-1.6 3.4-3.5V1.2H8V11H6.7V1.2H1.3v9.9zm13.1 9c2.4 0 4.4-1.5 5.5-3.7V21h1.3v-8.2c0-3.3-2.7-6-6-6s-6 2.7-6 6v8.2h1.3V20c1-.5 2.2-.9 3.9-.9z" />
                </svg>
            )
        },
        {
            name: 'Amazon',
            color: '#232f3e',
            link: upiIntent.amazonpay_link || upiIntent.bhim_link,
            icon: (
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
                    <path d="M15.93 17.13c-1.47.81-2.94 1.22-4.41 1.22-4.05 0-6.12-2.31-6.13-4.62 0-3.07 2.52-5.06 6.35-5.06h3.69V7.61c0-1.89-1.29-2.91-3.6-2.91-1.43 0-3 .42-4.32 1.22l-.76-2.05c1.42-.92 3.42-1.47 5.37-1.47 4.14 0 5.61 2.27 5.61 5.43v6.75c0 1.22.45 1.74 1.2 1.74.27 0 .54-.05.81-.14l.32 1.91c-.41.13-.82.18-1.23.18-1.74 0-2.82-1.27-2.9-3.26zm-3.69-6.95c-2.4 0-3.9 1.09-3.9 2.86 0 1.5.86 2.68 2.64 2.68 1.14 0 2.28-.46 3.42-1.36v-4.18h-2.16z" />
                </svg>
            )
        },
        {
            name: 'SBI',
            color: '#2563eb',
            link: upiIntent.bhim_link,
            icon: (
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                    <path d="M12 1C5.9 1 1 5.9 1 12s4.9 11 11 11 11-4.9 11-11S18.1 1 12 1zm0 18.5c-3.6 0-6.5-2.9-6.5-6.5s2.9-6.5 6.5-6.5 6.5 2.9 6.5 6.5-2.9 6.5-6.5 6.5z" />
                    <rect x="11" y="4" width="2" height="6.5" />
                </svg>
            )
        }
    ];

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
                <div className="relative bg-[#0a0a0a] border border-white/10 w-full max-w-[450px] rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,0.9)] animate-modalEntrance mx-auto max-h-[95vh] flex flex-col overflow-hidden">
                    {/* Header */}
                    <div className="bg-[#111] p-6 border-b border-white/5 flex justify-between items-center shrink-0">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg transform rotate-3">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                    <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold">Checkout Securely</p>
                                <p className="text-sm text-white font-medium tracking-tight">Order #{orderId}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            className="text-white/30 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-xl"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Payment Content */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <div className="p-8 space-y-8">
                            {/* Amount & Timer */}
                            <div className="text-center space-y-1">
                                <p className="text-[10px] text-white/30 uppercase tracking-[0.3em] font-bold">Amount to Pay</p>
                                <h2 className="text-5xl font-thin tracking-tighter text-white">₹{amount.toLocaleString('en-IN')}</h2>
                            </div>

                            {/* QR Code Container */}
                            <div className="relative aspect-square w-full max-w-[280px] mx-auto bg-white rounded-3xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] group">
                                {!sdkLoaded && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/5 rounded-3xl space-y-3">
                                        <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                                        <p className="text-[10px] text-black/40 uppercase tracking-widest font-bold">Secure Connection...</p>
                                    </div>
                                )}

                                {sessionId && (
                                    <iframe
                                        src={`https://qrstuff.me/gateway/iframe_pay/${sessionId}`}
                                        className="w-full h-full border-0 rounded-2xl"
                                        title="UPI QR Code"
                                        scrolling="no"
                                    />
                                )}

                                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                                    Official UPI QR
                                </div>
                            </div>

                            {/* Payment Apps Section */}
                            <div className="space-y-5">
                                <div className="flex items-center gap-4">
                                    <div className="h-px flex-1 bg-white/5" />
                                    <p className="text-[9px] text-white/20 uppercase tracking-[0.4em] font-bold">Direct App Payment</p>
                                    <div className="h-px flex-1 bg-white/5" />
                                </div>

                                <div className="grid grid-cols-5 gap-3">
                                    {upiApps.map((app) => (
                                        <a
                                            key={app.name}
                                            href={app.link || '#'}
                                            target={app.link ? "_self" : undefined}
                                            className={`flex flex-col items-center gap-2 group ${!app.link ? 'opacity-30 grayscale cursor-not-allowed' : 'cursor-pointer'}`}
                                            onClick={(e) => {
                                                if (!app.link) e.preventDefault();
                                            }}
                                        >
                                            <div
                                                className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-active:scale-95 shadow-lg relative overflow-hidden"
                                                style={{ backgroundColor: app.color }}
                                            >
                                                {/* App Specific Icons */}
                                                {app.icon}

                                                {/* Decorative Overlay */}
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                            </div>
                                            <span className="text-[8px] text-white/40 uppercase tracking-widest font-bold group-hover:text-white/60 transition-colors">{app.name}</span>
                                        </a>
                                    ))}
                                </div>
                                <p className="text-[8px] text-white/20 text-center uppercase tracking-widest leading-relaxed">
                                    Click an icon to pay directly via installed UPI app
                                </p>
                            </div>

                            {/* Security & Support */}
                            <div className="pt-4 flex flex-col items-center gap-4">
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-2 opacity-30">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                        </svg>
                                        <span className="text-[8px] uppercase tracking-widest font-bold">Secure</span>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-30">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                            <polyline points="22 4 12 14.01 9 11.01" />
                                        </svg>
                                        <span className="text-[8px] uppercase tracking-widest font-bold">Verified</span>
                                    </div>
                                </div>
                                <div className="bg-white/5 w-full p-4 rounded-2xl border border-white/5 text-center">
                                    <p className="text-[9px] text-white/40 leading-relaxed uppercase tracking-tighter">
                                        Waiting for payment. Do not refresh or close this window.
                                    </p>
                                </div>
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
                    from { opacity: 0; transform: scale(0.95) translateY(30px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                .animate-modalEntrance {
                    animation: modalEntrance 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
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
            `}</style>
        </>
    );
}
