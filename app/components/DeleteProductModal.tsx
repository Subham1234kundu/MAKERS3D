'use client';

import { useState, useEffect } from 'react';
import { gsap } from 'gsap';

interface DeleteProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    productName: string;
}

export default function DeleteProductModal({ isOpen, onClose, onConfirm, productName }: DeleteProductModalProps) {
    const [inputValue, setInputValue] = useState('');
    const [shake, setShake] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setInputValue('');
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    const handleDelete = () => {
        if (inputValue === productName) {
            onConfirm();
        } else {
            setShake(true);
            setTimeout(() => setShake(false), 500);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className={`relative bg-neutral-900 border border-white/10 w-full max-w-md p-8 shadow-2xl transition-all duration-300 ${shake ? 'animate-shake' : ''}`}>
                <div className="text-center mb-8">
                    <div className="w-12 h-12 border border-red-500/50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-bold uppercase tracking-widest text-white mb-2">Delete Product?</h3>
                    <p className="text-sm text-white/40 leading-relaxed">
                        This action cannot be undone. This will permanently delete <br />
                        <span className="text-white font-medium">"{productName}"</span> from your inventory.
                    </p>
                </div>

                <div className="space-y-6">
                    <div className="group">
                        <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2">
                            Type <span className="text-white select-all">"{productName}"</span> to confirm
                        </label>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            className="w-full bg-black/50 border border-white/10 py-3 px-4 text-sm text-white focus:outline-none focus:border-red-500/50 transition-colors placeholder:text-white/10 text-center tracking-wide"
                            placeholder={productName}
                            autoFocus
                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 text-[10px] uppercase tracking-widest border border-white/10 text-white/60 hover:text-white hover:bg-white/5 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={inputValue !== productName}
                            className={`flex-1 py-3 text-[10px] uppercase tracking-widest font-bold transition-all
                                ${inputValue === productName
                                    ? 'bg-red-600 text-white hover:bg-red-700'
                                    : 'bg-white/5 text-white/20 cursor-not-allowed border border-transparent'
                                }`}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
                .animate-shake {
                    animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
                }
            `}</style>
        </div>
    );
}
