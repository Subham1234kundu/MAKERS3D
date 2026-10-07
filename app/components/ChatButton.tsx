'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const SOCIAL_BUTTON = 'grid h-11 w-11 shrink-0 place-items-center rounded-full text-white shadow-[0_4px_16px_rgba(0,0,0,0.15)] transition-transform duration-200 hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black sm:h-14 sm:w-14';

export default function ChatButton() {
    const [phase, setPhase] = useState<'closed' | 'open' | 'closing'>('closed');
    const isOpen = phase === 'open';
    const toggle = useRef<HTMLButtonElement>(null);
    const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const closeOptions = useCallback(() => {
        if (closeTimer.current) clearTimeout(closeTimer.current);
        closeTimer.current = null;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setPhase('closed');
            return;
        }
        setPhase('closing');
        closeTimer.current = setTimeout(() => {
            setPhase('closed');
            closeTimer.current = null;
        }, 360);
    }, []);

    const toggleOptions = () => {
        if (isOpen) {
            closeOptions();
            return;
        }
        if (closeTimer.current) clearTimeout(closeTimer.current);
        closeTimer.current = null;
        setPhase('open');
    };

    useEffect(() => () => {
        if (closeTimer.current) clearTimeout(closeTimer.current);
    }, []);

    useEffect(() => {
        if (!isOpen) return;
        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key !== 'Escape') return;
            closeOptions();
            toggle.current?.focus();
        };
        window.addEventListener('keydown', closeOnEscape);
        return () => window.removeEventListener('keydown', closeOnEscape);
    }, [isOpen, closeOptions]);

    return (
        <div className="chat-fab fixed right-4 z-[9999] flex w-11 flex-col items-center sm:right-8 sm:w-14" data-chat-state={phase}>
            <div id="contact-social-buttons" className="chat-social-options" inert={!isOpen} aria-hidden={!isOpen}>
                <div className="chat-social-item chat-social-whatsapp">
                    <a
                        href="https://wa.me/917863983914"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Chat on WhatsApp"
                        className={`${SOCIAL_BUTTON} bg-[#25D366]`}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" focusable="false" className="sm:h-7 sm:w-7">
                            <path d="M12.006 2C6.477 2 2.011 6.471 2.011 12c0 1.918.543 3.707 1.483 5.228L2 22l5.006-1.314A9.957 9.957 0 0012.006 22c5.529 0 9.994-4.471 9.994-10s-4.465-10-9.994-10z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" fill="currentColor" />
                        </svg>
                    </a>
                </div>
                <div className="chat-social-item chat-social-instagram">
                    <a
                        href="https://www.instagram.com/makers3d.in"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="MAKERS3D on Instagram"
                        className={`${SOCIAL_BUTTON} bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]`}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" focusable="false" className="sm:h-7 sm:w-7">
                            <rect x="3" y="3" width="18" height="18" rx="5" />
                            <circle cx="12" cy="12" r="4" />
                            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                        </svg>
                    </a>
                </div>
            </div>

            <button
                ref={toggle}
                type="button"
                onClick={toggleOptions}
                aria-label={isOpen ? 'Close contact options' : phase === 'closing' ? 'Open contact options' : 'Contact Support'}
                aria-expanded={isOpen}
                aria-controls="contact-social-buttons"
                className={`${SOCIAL_BUTTON} chat-toggle relative isolate bg-black ${phase === 'closed' ? 'motion-safe:animate-heartbeat' : ''}`}
            >
                {phase !== 'closed' ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true" focusable="false" className="sm:h-6 sm:w-6">
                        <path d="m6 6 12 12M18 6 6 18" />
                    </svg>
                ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" className="sm:h-6 sm:w-6">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeWidth="1.5" />
                        <path d="M8 10h.01M12 10h.01M16 10h.01" strokeWidth="2" />
                    </svg>
                )}
            </button>
        </div>
    );
}
