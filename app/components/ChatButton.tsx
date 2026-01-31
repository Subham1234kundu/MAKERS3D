'use client';

import { useState } from 'react';

export default function ChatButton() {
    const [isHovered, setIsHovered] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-32 right-4 sm:bottom-8 sm:right-8 z-[9999] flex flex-col items-end gap-4" suppressHydrationWarning>
            {/* Contact Options Box */}
            <div
                className={`bg-black/80 backdrop-blur-xl border border-white/10 p-4 sm:p-6 rounded-2xl transition-all duration-500 origin-bottom-right shadow-[0_20px_50px_rgba(0,0,0,0.5)] ${isOpen ? 'scale-100 opacity-100' : 'scale-90 opacity-0 pointer-events-none'
                    }`}
                suppressHydrationWarning
            >
                <h4 className="text-white font-thin text-[10px] sm:text-xs uppercase tracking-[0.2em] mb-4 sm:mb-6 text-center">Connect</h4>

                <div className="flex flex-col gap-4 sm:gap-5" suppressHydrationWarning>
                    {/* WhatsApp Option */}
                    <a
                        href="https://wa.me/917863983914"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 sm:gap-4 group/item"
                        suppressHydrationWarning
                    >
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#25D366]/10 flex items-center justify-center transition-all duration-300 group-hover/item:bg-[#25D366]/20" suppressHydrationWarning>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="#25D366" xmlns="http://www.w3.org/2000/svg" className="sm:w-5 sm:h-5">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12.006 2C6.477 2 2.011 6.471 2.011 12c0 1.918.543 3.707 1.483 5.228L2 22l5.006-1.314A9.957 9.957 0 0012.006 22c5.529 0 9.994-4.471 9.994-10s-4.465-10-9.994-10z" />
                            </svg>
                        </div>
                        <div className="flex flex-col" suppressHydrationWarning>
                            <span className="text-white text-[13px] sm:text-sm font-light tracking-wide transition-colors" suppressHydrationWarning>WhatsApp</span>
                        </div>
                    </a>

                    {/* Instagram Option */}
                    <a
                        href="https://www.instagram.com/makers3d.in"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 sm:gap-4 group/item"
                        suppressHydrationWarning
                    >
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/5 flex items-center justify-center transition-all duration-300 group-hover/item:bg-white/10 overflow-hidden relative" suppressHydrationWarning>
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] opacity-20 group-hover/item:opacity-40 transition-opacity" suppressHydrationWarning />
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg" className="relative z-10 sm:w-5 sm:h-5">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                            </svg>
                        </div>
                        <div className="flex flex-col" suppressHydrationWarning>
                            <span className="text-white text-[13px] sm:text-sm font-light tracking-wide transition-colors" suppressHydrationWarning>Instagram</span>
                        </div>
                    </a>
                </div>
            </div>

            <button
                onClick={() => setIsOpen(!isOpen)}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={`relative group p-3 sm:p-4 rounded-full transition-all duration-500 hover:scale-110 active:scale-95 ${isOpen ? 'bg-black border border-white/20' : 'bg-white animate-[heartbeat_2s_infinite_ease-in-out]'
                    } shadow-[0_10px_40px_rgba(255,255,255,0.15)]`}
                aria-label="Contact Support"
                suppressHydrationWarning
            >
                {/* Glow Effect */}
                <div className={`absolute inset-0 rounded-full blur-xl transition-opacity duration-500 ${isOpen ? 'bg-white/5 opacity-40' : (isHovered ? 'bg-white/20 opacity-100' : 'opacity-0')
                    }`} />

                {/* Icon */}
                <div className="relative z-10 transition-transform duration-500" style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0)' }}>
                    {isOpen ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="sm:w-6 sm:h-6">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    ) : (
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="text-black sm:w-6 sm:h-6"
                        >
                            <path
                                d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M12 10H12.01M8 10H8.01M16 10H16.01"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    )}
                </div>

                {!isOpen && (
                    <div className="absolute inset-0 rounded-full border border-white/50 animate-ping opacity-20 pointer-events-none" />
                )}
            </button>
        </div>
    );
}
