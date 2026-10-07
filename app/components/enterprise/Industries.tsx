'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { SECTORS } from './content';
import { Section, Eyebrow, Reveal, Cta } from './primitives';

/**
 * "Who we build for" — a scroll-driven index.
 *
 * Left: a tight numbered list (01–05) with nothing but hairline rules.
 * Right: a sticky column whose description, image and applications swap to
 * match whichever row is crossing the middle of the viewport. No panels, no
 * fills, no blur plate — the rules carry all the structure.
 *
 * Below lg there is no sticky column, so the list becomes a tap-to-open
 * accordion instead: scroll-driven switching there would expand and collapse
 * rows under the reader's thumb.
 */
export default function Industries() {
  // -1 = every row closed (only reachable in the mobile accordion).
  const [active, setActive] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const sync = () => setIsDesktop(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (!isDesktop || typeof IntersectionObserver === 'undefined') return;
    setActive((a) => Math.max(a, 0));

    // A thin band across the viewport centre: whichever row overlaps it wins.
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const i = Number((entry.target as HTMLElement).dataset.index);
            if (!Number.isNaN(i)) setActive(i);
          }
        }
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    );

    rowRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [isDesktop]);

  const sector = SECTORS[Math.max(active, 0)];

  return (
    <Section id="industries" className="py-16 sm:py-24 lg:py-36">
      <Reveal>
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <Eyebrow>Industries</Eyebrow>
            <h2 className="lp-lines m3-display mt-7 text-[clamp(2rem,4.6vw,3.5rem)] text-black">
              Built for the
              <br />
              <span className="text-black/35">industries that build.</span>
            </h2>
          </div>
          <p className="lp-words m3-lede max-w-[520px] text-[15px] lg:justify-self-end">
            Different industries, one requirement: a physical object accurate enough to
            be trusted. Pick one to see what we make for it.
          </p>
        </div>
      </Reveal>

      <div className="mt-10 grid sm:mt-16 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
        {/* ---- Numbered index (left) ---- */}
        <div className="lp-stagger border-t border-black/[0.10]">
          {SECTORS.map((s, i) => {
            const on = i === active;
            return (
              <div
                key={s.id}
                ref={(el) => {
                  rowRefs.current[i] = el;
                }}
                data-index={i}
                className="border-b border-black/[0.10]"
              >
                <button
                  type="button"
                  onClick={() => {
                    if (isDesktop) {
                      setActive(i);
                      rowRefs.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    } else {
                      setActive(on ? -1 : i);
                    }
                  }}
                  aria-expanded={isDesktop ? undefined : on}
                  aria-pressed={isDesktop ? on : undefined}
                  className="group flex w-full items-center gap-5 py-5 text-left sm:gap-6 sm:py-7 lg:items-baseline lg:gap-8 lg:py-9"
                >
                  <span
                    className={[
                      'm3-morph shrink-0 font-mono text-[13px] tabular-nums tracking-[0.08em]',
                      on ? 'text-black' : 'text-black/25',
                    ].join(' ')}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  <span
                    className={[
                      'm3-morph flex-1 text-[clamp(1.375rem,2.6vw,2rem)] font-light tracking-tight',
                      on ? 'text-black' : 'text-black/30 group-hover:text-black/60',
                    ].join(' ')}
                  >
                    {s.name}
                  </span>

                  {/* Active marker — a rule that extends rather than a fill */}
                  <span
                    className={[
                      'm3-morph hidden h-px shrink-0 bg-black lg:block',
                      on ? 'w-10 opacity-70' : 'w-3 opacity-15',
                    ].join(' ')}
                  />

                  {/* Accordion toggle on small screens: a plus that turns into a cross */}
                  <span
                    aria-hidden="true"
                    className={[
                      'relative grid h-8 w-8 shrink-0 place-items-center border transition-colors duration-500 lg:hidden',
                      on ? 'border-black/40' : 'border-black/15',
                    ].join(' ')}
                  >
                    <span
                      className={`relative grid h-3 w-3 place-items-center transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        on ? 'rotate-45' : ''
                      }`}
                    >
                      <span className="absolute h-px w-3 bg-black" />
                      <span className="absolute h-3 w-px bg-black" />
                    </span>
                  </span>
                </button>

                {/* Inline detail on small screens, where the sticky column is hidden */}
                {on && (
                  <div
                    className="pb-8 lg:hidden"
                    style={{ animation: 'fadeInUp 0.6s cubic-bezier(0.16,1,0.3,1) both' }}
                  >
                    <p className="m3-lede max-w-[520px] text-[14px]">{s.thesis}</p>

                    <div className="relative mt-6 aspect-[21/9] w-full overflow-hidden">
                      <Image
                        src={s.image}
                        alt={`Representative part produced for the ${s.name.toLowerCase()} sector`}
                        fill
                        sizes="100vw"
                        className="object-cover opacity-85"
                      />
                    </div>

                    <ul className="mt-5 grid grid-cols-2 gap-x-6">
                      {s.applications.map((a) => (
                        <li
                          key={a}
                          className="border-b border-black/[0.08] py-3 text-[12px] font-light text-black/55"
                        >
                          {a}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-6">
                      <Cta href={`/industries#${s.id}`} className="w-full justify-between">
                        More on {s.name}
                      </Cta>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ---- Sticky description (right, lg+) ---- */}
        <div className="hidden lg:block">
          <div className="sticky top-[104px]">
            <div className="flex items-baseline justify-between border-b border-black/[0.10] pb-4">
              <span className="m3-eyebrow">What we build</span>
              <span className="font-mono text-[11px] tabular-nums tracking-[0.18em] text-black/30">
                {String(active + 1).padStart(2, '0')}
                <span className="text-black/15"> / {String(SECTORS.length).padStart(2, '0')}</span>
              </span>
            </div>

            {/* Re-keyed so the whole block re-forms whenever the row changes */}
            <div
              key={sector.id}
              style={{ animation: 'fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) both' }}
            >
              <h3 className="mt-8 text-[clamp(1.5rem,2.4vw,1.875rem)] font-light tracking-tight text-black">
                {sector.name}
              </h3>

              <p className="m3-lede mt-5 max-w-[460px] text-[15px]">{sector.thesis}</p>

              {sector.body && (
                <p className="m3-lede mt-4 max-w-[460px] text-[13px] text-black/35">
                  {sector.body}
                </p>
              )}

              <div className="group relative mt-9 aspect-[16/9] w-full overflow-hidden">
                <Image
                  src={sector.image}
                  alt={`Representative part produced for the ${sector.name.toLowerCase()} sector`}
                  fill
                  sizes="50vw"
                  className="scale-[1.04] object-cover opacity-85 transition-[opacity,transform] duration-[1600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-100 group-hover:opacity-100"
                />
              </div>

              <ul className="mt-8 grid grid-cols-2 gap-x-8">
                {(sector.outcomes ?? sector.applications).map((a) => (
                  <li
                    key={a}
                    className="border-b border-black/[0.10] py-3.5 text-[13px] font-light text-black/60"
                  >
                    {a}
                  </li>
                ))}
              </ul>

              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Cta href={`/industries#${sector.id}`}>More on {sector.name}</Cta>
                <Cta href="/contact" tone="solid">
                  Get a Free Quote
                </Cta>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Reveal delay={140} className="lp-fade">
        <div className="mt-14">
          <Cta href="/industries">Explore Every Industry</Cta>
        </div>
      </Reveal>
    </Section>
  );
}
