'use client';

import Image from 'next/image';
import { CLIENTS } from './content';

/**
 * Logo marquee of brands we have built for. Each copy of the track repeats
 * the roster so a single copy is always wider than the viewport, which keeps
 * the loop seamless even with only a handful of logos.
 */
export default function ClientRail() {
  const track = [...CLIENTS, ...CLIENTS, ...CLIENTS];

  return (
    <section className="relative overflow-hidden border-t border-black/[0.08] bg-white py-6 sm:py-8">
      <div className="lp-fade m3-shell mb-5 sm:mb-6">
        <span className="m3-eyebrow !text-[#626262]">Brands we have built for</span>
      </div>

      <div className="lp-fade relative flex select-none">
        {/* Edge fade so the loop never shows a hard seam */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[2]"
          style={{
            background:
              'linear-gradient(90deg, #fff 0%, transparent 12%, transparent 88%, #fff 100%)',
          }}
        />

        {[0, 1].map((copy) => (
          <ul
            key={copy}
            aria-hidden={copy === 1}
            className="m3-drift flex shrink-0 items-center gap-14 pr-14 sm:gap-20 sm:pr-20"
          >
            {track.map((c, i) => (
              <li key={`${copy}-${c.name}-${i}`} className="flex h-14 shrink-0 items-center">
                <Image
                  src={c.logo}
                  alt={copy === 0 && i < CLIENTS.length ? c.name : ''}
                  width={c.width}
                  height={c.height}
                  // Served as-is: the files are small, pre-trimmed PNGs, and the
                  // optimizer adds a cache layer that can hold a stale result.
                  unoptimized
                  // The track moves by CSS animation, which browsers don't
                  // treat as scrolling into view — lazy logos would stay blank.
                  loading="eager"
                  className="w-auto opacity-80 transition-opacity duration-500 hover:opacity-100"
                  style={{ height: c.displayHeight }}
                />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  );
}
