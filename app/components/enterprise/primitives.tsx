'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

/**
 * True inside a GSAP-driven page (see LandingMotion). `<Reveal>` then renders
 * a plain wrapper so the CSS reveal and GSAP never fight over one element.
 */
export const MotionManaged = createContext(false);

/**
 * Reveals children once they enter the viewport. Falls back to visible
 * immediately when IntersectionObserver is unavailable.
 */
export function Reveal({
  children,
  delay = 0,
  as = 'div',
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
}) {
  // Cast to a concrete signature: the union of every intrinsic element's props
  // collapses to `never`, so TS cannot check a truly polymorphic tag here.
  const Tag = as as unknown as React.FC<
    React.HTMLAttributes<HTMLElement> & { ref?: React.Ref<HTMLElement> }
  >;
  const managed = useContext(MotionManaged);
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (managed) return;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setShown(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );

    io.observe(node);
    return () => io.disconnect();
  }, [managed]);

  if (managed) {
    return (
      <Tag ref={ref as React.Ref<HTMLElement>} className={className}>
        {children}
      </Tag>
    );
  }

  return (
    <Tag
      ref={ref as React.Ref<HTMLElement>}
      className={`m3-reveal ${shown ? 'is-in' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

/** Mono eyebrow with the leading rule used throughout the page. */
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="lp-eyebrow flex items-center gap-4">
      <span className="lp-eyebrow-rule h-px w-8 bg-black/20" />
      <span className="m3-eyebrow">{children}</span>
    </div>
  );
}

/** Section wrapper: full-bleed hairline top border + centered shell. */
export function Section({
  id,
  children,
  className = '',
  bordered = true,
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
  bordered?: boolean;
}) {
  return (
    <section
      id={id}
      className={`relative ${bordered ? 'border-t border-black/[0.08]' : ''} ${className}`}
    >
      <div className="m3-rails" aria-hidden="true" />
      <div className="m3-shell relative z-[1]">{children}</div>
    </section>
  );
}

/**
 * Square-cornered CTA. `tone="solid"` inverts to white-on-white for the
 * single primary action per view.
 */
export function Cta({
  href,
  children,
  tone = 'ghost',
  className = '',
}: {
  href: string;
  children: React.ReactNode;
  tone?: 'solid' | 'ghost';
  className?: string;
}) {
  const solid = tone === 'solid';

  return (
    <a
      href={href}
      className={[
        'group m3-sheen m3-morph inline-flex items-center gap-4 px-8 py-4',
        'text-[11px] font-medium uppercase tracking-[0.22em]',
        'border',
        solid
          ? 'bg-black text-white border-black hover:bg-transparent hover:text-black'
          : 'bg-transparent text-black border-black/20 hover:border-black/60 hover:bg-black/[0.03]',
        className,
      ].join(' ')}
    >
      <span>{children}</span>
      <svg
        width="15"
        height="9"
        viewBox="0 0 15 9"
        fill="none"
        aria-hidden="true"
        className="transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5"
      >
        <path d="M0 4.5h13M9.5 1l3.5 3.5L9.5 8" stroke="currentColor" strokeWidth="1" />
      </svg>
    </a>
  );
}
