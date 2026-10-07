'use client';

import React, { useRef } from 'react';
import { gsap, LOADED_EVENT, ScrollTrigger, SplitText, useGSAP } from '@/lib/gsap';
import { MotionManaged } from './primitives';
import { mute, scrollReveals, unhideIntro } from './motion';

/**
 * GSAP choreography for the landing page. Most sections are server
 * components, so they only carry `lp-*` marker classes (see motion.ts);
 * this wrapper finds them and animates them. `<Reveal>` steps aside inside
 * it (MotionManaged) so CSS and GSAP never animate the same element.
 */
export default function LandingMotion({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      unhideIntro(el);
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      /* ---- Hero intro: built paused, played once the loader clears ---- */

      const intro = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });

      intro.from('.lp-hero-beam', { opacity: 0, scale: 1.08, duration: 1.8, ease: 'power2.out' }, 0);

      const heroTitle = SplitText.create('.lp-hero-title', { type: 'lines', mask: 'lines' });
      intro.from(
        heroTitle.lines,
        { yPercent: 110, duration: 1.1, ease: 'expo.out', stagger: 0.1 },
        0.25,
      );

      const heroLede = SplitText.create('.lp-hero-lede', { type: 'words' });
      // The CTAs carry .m3-morph, whose CSS transform transition would drag
      // behind every GSAP frame; mute it for the tween only.
      mute('.lp-hero-cta > *');
      intro
        .from(
          heroLede.words,
          { opacity: 0.08, y: 8, duration: 0.6, ease: 'power2.out', stagger: 0.014 },
          0.6,
        )
        .from(
          '.lp-hero-cta > *',
          { y: 24, opacity: 0, duration: 0.8, stagger: 0.1, clearProps: 'transition' },
          0.85,
        )
        // Offer chips deal in one at a time.
        .from(
          '.lp-hero-list li',
          { y: 14, opacity: 0, scale: 0.92, duration: 0.5, ease: 'back.out(1.7)', stagger: 0.07 },
          1,
        )
        // The product visual drifts in and settles.
        .from(
          '.lp-hero-art',
          { xPercent: 8, rotate: -10, scale: 0.86, opacity: 0, duration: 1.6 },
          0.3,
        )
        .from('.lp-hero-metric > *', { y: 24, opacity: 0, duration: 0.7, stagger: 0.05 }, 0.9);

      const start = () => {
        intro.play();
        // Images and fonts have settled by now; re-measure every trigger.
        ScrollTrigger.refresh();
      };
      if (window.__m3Loaded) start();
      else window.addEventListener(LOADED_EVENT, start, { once: true });

      scrollReveals(el);

      return () => window.removeEventListener(LOADED_EVENT, start);
    },
    { scope: root },
  );

  return (
    <MotionManaged.Provider value>
      <div ref={root} className="lp-motion">
        {children}
      </div>
    </MotionManaged.Provider>
  );
}
