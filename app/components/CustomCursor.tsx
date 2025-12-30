'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHoveringText, setIsHoveringText] = useState(false);
  const [isLargeCursor, setIsLargeCursor] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const cursor = cursorRef.current;
    if (!cursor) return;

    // Use quickSetter for high-performance updates
    const xSetter = gsap.quickSetter(cursor, "x", "px");
    const ySetter = gsap.quickSetter(cursor, "y", "px");

    const moveCursor = (e: MouseEvent) => {
      if (!hasMoved) setHasMoved(true);
      // Offset by half of cursor size for centering
      xSetter(e.clientX);
      ySetter(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      setIsHoveringText(!!target.closest('.logo-text-container'));

      const largeElement = target.closest('[data-cursor-size="large"]');
      setIsLargeCursor(!!largeElement);
    };

    window.addEventListener('mousemove', moveCursor, { passive: true });
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <>
      <div
        ref={cursorRef}
        className={`custom-cursor ${isHoveringText ? 'hover-text' : ''} ${isLargeCursor ? 'large-cursor' : ''}`}
        style={{ opacity: hasMoved ? 1 : 0 }}
      >
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 10 L90 30 L90 70 L50 90 L10 70 L10 30 Z" fill="white" />
          <path d="M50 10 L50 50 L90 70 L90 30 Z" fill="white" opacity="0.7" />
          <path d="M50 10 L50 50 L10 70 L10 30 Z" fill="white" opacity="0.5" />
          <path d="M50 50 L50 90 L90 70 Z" fill="white" opacity="0.6" />
          <path d="M50 50 L50 90 L10 70 Z" fill="white" opacity="0.4" />
        </svg>
      </div>
      <style jsx>{`
        .custom-cursor {
          position: fixed;
          left: 0;
          top: 0;
          pointer-events: none;
          z-index: 10000;
          width: 15px; /* Force default small size */
          height: 15px; /* Force default small size */
          transition: width 0.3s cubic-bezier(0.23, 1, 0.32, 1), 
                      height 0.3s cubic-bezier(0.23, 1, 0.32, 1),
                      opacity 0.2s ease;
          mix-blend-mode: difference;
          display: flex;
          align-items: center;
          justify-content: center;
          transform: translate(-50%, -50%);
        }

        .custom-cursor svg {
          width: 100%;
          height: 100%;
        }

        .custom-cursor {
          width: 15px;
          height: 15px;
        }

        .custom-cursor.hover-text {
          width: 80px;
          height: 80px;
        }

        .custom-cursor.large-cursor {
          width: 120px;
          height: 120px;
        }

        @media (max-width: 768px) {
          .custom-cursor {
            display: none;
          }
        }
      `}</style>
      <style jsx global>{`
        * {
          cursor: none !important;
        }

        @media (max-width: 768px) {
          * {
            cursor: auto !important;
          }
        }
      `}</style>
    </>
  );
}
