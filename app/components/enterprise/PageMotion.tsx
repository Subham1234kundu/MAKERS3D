'use client';

import React, { useRef } from 'react';
import { gsap, ScrollTrigger, SplitText, useGSAP } from '@/lib/gsap';
import { MotionManaged } from './primitives';
import { scrollReveals, unhideIntro } from './motion';

/**
 * GSAP choreography for the inner pages (services, industries, partner):
 * the same vocabulary as the landing page, but with no loader, so the
 * masthead plays its intro straight away. The masthead is marked
 * `lp-masthead lp-intro`; CSS keeps `lp-intro` hidden until this runs, so
 * the server-rendered text never flashes before the animation starts.
 */
export default function PageMotion({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      unhideIntro(el);
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // The nav stays static; only the masthead animates.
      const field = el.querySelector('.lp-masthead-field');
      if (field) {
        tl.from(
          field,
          { opacity: 0, scale: 1.08, duration: 1.8, ease: 'power2.out' },
          0,
        );
      }

      const heroImage = el.querySelector('.lp-masthead-image');
      if (heroImage) {
        tl.from(heroImage, { opacity: 0, y: 24, duration: 1.1 }, 0.3);
      }

      const eyebrow = el.querySelector('.lp-masthead .lp-eyebrow');
      if (eyebrow) {
        tl.from(
          eyebrow.querySelector('.lp-eyebrow-rule'),
          { scaleX: 0, transformOrigin: 'left center', duration: 0.8 },
          0.1,
        ).from(eyebrow.querySelector('.m3-eyebrow'), { x: -12, opacity: 0, duration: 0.8 }, 0.2);
      }

      const title = el.querySelector('.lp-masthead-title');
      if (title) {
        const split = SplitText.create(title, { type: 'lines', mask: 'lines' });
        tl.from(
          split.lines,
          { yPercent: 110, duration: 1.1, ease: 'expo.out', stagger: 0.1 },
          0.25,
        );
      }

      const lede = el.querySelector('.lp-masthead-lede');
      if (lede) {
        const split = SplitText.create(lede, { type: 'words' });
        tl.from(
          split.words,
          { opacity: 0.08, y: 8, duration: 0.6, ease: 'power2.out', stagger: 0.014 },
          0.6,
        );
      }

      // Image band under the masthead: panels wipe up one after another.
      const band = el.querySelector('.lp-masthead-band');
      if (band) {
        tl.fromTo(
          band.children,
          { clipPath: 'inset(100% 0% 0% 0%)' },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 1.1,
            ease: 'expo.inOut',
            stagger: 0.18,
            clearProps: 'clipPath',
          },
          0.7,
        ).fromTo(
          band.querySelectorAll('.lp-card-art'),
          { scale: 1.2 },
          { scale: 1, duration: 1.6, ease: 'expo.out', stagger: 0.18 },
          0.75,
        );
      }

      scrollReveals(el);
      // Fonts and images shift layout after hydration; re-measure once settled.
      tl.eventCallback('onComplete', () => ScrollTrigger.refresh());
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
