'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { gsap, LOADED_EVENT, useGSAP } from '@/lib/gsap';

/**
 * Landing-page intro. The mark starts oversized and close, then recedes
 * into the distance as the curtain lifts, handing off to the hero. The
 * hero listens for `m3:loaded` so its own reveal starts only once this
 * has cleared. Plays once per visit: returning to `/` client-side skips it.
 */
export default function Loader() {
  const root = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(
    () => typeof window !== 'undefined' && Boolean(window.__m3Loaded),
  );

  useGSAP(
    () => {
      if (done) return;

      // Locked on <html>, not <body>: the nav resets body overflow on mount.
      const html = document.documentElement;
      html.style.overflow = 'hidden';

      const finish = () => {
        html.style.overflow = '';
        window.__m3Loaded = true;
        window.dispatchEvent(new Event(LOADED_EVENT));
        setDone(true);
      };

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        finish();
        return;
      }

      gsap
        .timeline({ onComplete: finish })
        .fromTo(
          '.loader-mark',
          { scale: 5.5, opacity: 0, filter: 'blur(18px)' },
          {
            scale: 1,
            opacity: 1,
            filter: 'blur(0px)',
            duration: 1.05,
            ease: 'expo.out',
          },
        )
        .fromTo(
          '.loader-word',
          { opacity: 0, letterSpacing: '0.9em' },
          { opacity: 1, letterSpacing: '0.4em', duration: 0.7, ease: 'power3.out' },
          '-=0.55',
        )
        // The mark keeps travelling away from the viewer as it leaves.
        .to(
          '.loader-mark',
          {
            scale: 0.2,
            opacity: 0,
            filter: 'blur(10px)',
            duration: 0.5,
            ease: 'power3.in',
          },
          '+=0.15',
        )
        .to('.loader-word', { opacity: 0, y: -10, duration: 0.3, ease: 'power2.in' }, '<')
        .to(
          '.loader-curtain',
          { yPercent: -100, duration: 0.6, ease: 'power4.inOut' },
          '-=0.22',
        );
    },
    { scope: root },
  );

  if (done) return null;

  return (
    <div ref={root} aria-hidden>
      <div className="loader-curtain fixed inset-0 z-[100000] flex flex-col items-center justify-center gap-10 bg-black">
        <Image
          src="/images/logo.png"
          alt=""
          width={778}
          height={628}
          priority
          className="loader-mark h-auto w-[180px] opacity-0 sm:w-[240px] lg:w-[300px]"
        />
        <span className="loader-word text-[11px] font-light uppercase tracking-[0.4em] text-white/60 opacity-0">
          Makers3D
        </span>
      </div>
    </div>
  );
}
