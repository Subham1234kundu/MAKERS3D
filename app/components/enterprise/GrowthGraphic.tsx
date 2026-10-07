'use client';

import { useId, useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';

const HEIGHTS = [36, 70, 111, 155, 204];

export default function GrowthGraphic() {
  const root = useRef<HTMLDivElement>(null);
  const id = useId().replace(/:/g, '');

  useGSAP(() => {
    if (!root.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const bars = root.current.querySelectorAll('[data-growth-bar]');
    const line = root.current.querySelector<SVGPathElement>('[data-growth-line]');
    const tip = root.current.querySelector('[data-growth-tip]');
    if (!line || !tip) return;
    const length = line.getTotalLength();
    gsap.set(line, { strokeDasharray: length });

    const timeline = gsap.timeline({
      scrollTrigger: { trigger: root.current, start: 'top 85%', end: 'bottom top', toggleActions: 'play pause resume pause' },
    });
    timeline
      .fromTo(bars, { scaleY: 0.05, opacity: 0, transformOrigin: '50% 100%' },
        { scaleY: 1, opacity: 1, duration: 1.1, stagger: 0.13, ease: 'power3.out' }, 0)
      .fromTo(line, { strokeDashoffset: length, opacity: 1 },
        { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut' }, 0.2)
      .fromTo(tip, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' }, 1.7);
  }, { scope: root });

  return (
    <div ref={root} className="absolute inset-0 bg-white">
      <svg viewBox="0 0 635 331" className="h-full w-full" role="img" aria-label="Violet columns grow upward with a rising arrow, illustrating increasing production capacity">
        <defs>
          <linearGradient id={`${id}-front`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#a78bfa" />
            <stop offset="0.55" stopColor="#8b5cf6" />
            <stop offset="1" stopColor="#6d28d9" />
          </linearGradient>
          <linearGradient id={`${id}-side`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#7c3aed" />
            <stop offset="1" stopColor="#5b21b6" />
          </linearGradient>
          <filter id={`${id}-shadow`} x="-50%" y="-200%" width="200%" height="500%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
        </defs>

        {HEIGHTS.map((height, index) => {
          const x = 100 + index * 86;
          const y = 277 - height;
          return (
            <g key={height}>
              <ellipse cx={x + 37} cy="285" rx="36" ry="5" fill="#7c3aed" opacity="0.09" filter={`url(#${id}-shadow)`} />
              <g data-growth-bar>
                <path d={`M${x},${y} L${x + 46},${y} V277 H${x} Z`} fill={`url(#${id}-front)`} />
                <path d={`M${x + 46},${y} L${x + 62},${y - 10} V267 L${x + 46},277 Z`} fill={`url(#${id}-side)`} />
                <path d={`M${x},${y} L${x + 16},${y - 10} H${x + 62} L${x + 46},${y} Z`} fill="#c4b5fd" />
                <path d={`M${x + 1},${y + 1} H${x + 45}`} stroke="#ddd6fe" strokeWidth="1" opacity="0.75" />
              </g>
            </g>
          );
        })}

        <path data-growth-line d="M101 217 C173 217 185 173 250 166 S357 137 403 89 S465 48 512 32" fill="none" stroke="#8b5cf6" strokeWidth="4" strokeLinecap="round" />
        <path data-growth-tip d="M498 30 L513 31 L510 46" fill="none" stroke="#8b5cf6" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
