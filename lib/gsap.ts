'use client';

import { useEffect, useLayoutEffect, type DependencyList, type RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

declare global {
  interface Window {
    /** Set once the landing loader has cleared, so a remount can skip it. */
    __m3Loaded?: boolean;
  }
}

/** Fired on window when the landing loader's curtain has lifted. */
export const LOADED_EVENT = 'm3:loaded';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * Runs GSAP setup inside a `gsap.context` scoped to `scope`, and reverts
 * every tween, ScrollTrigger and split it created on unmount.
 */
export function useGSAP(
  callback: () => void | (() => void),
  { scope, dependencies = [] }: { scope?: RefObject<Element | null>; dependencies?: DependencyList } = {},
) {
  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(callback, scope?.current ?? undefined);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
}

type Targets = string | Element | Element[] | NodeListOf<Element>;
type RevealOptions = {
  /** ScrollTrigger start; pass `false` to play immediately (or via `paused`). */
  start?: string | false;
  delay?: number;
  paused?: boolean;
  /** Per-piece tween length and gap between pieces (splitWordsReveal). */
  duration?: number;
  stagger?: number;
};

function scrollTrigger(el: Element, start: RevealOptions['start']) {
  return start === false ? undefined : { trigger: el, start: start ?? 'top 85%' };
}

/**
 * Headline rises line by line out of a mask, so each line is uncovered
 * rather than faded in.
 */
export function headlineLinesReveal(targets: Targets, opts: RevealOptions = {}) {
  const tweens: gsap.core.Tween[] = [];
  gsap.utils.toArray<HTMLElement>(targets).forEach((el) => {
    SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      autoSplit: true,
      // onSplit may return the animation so autoSplit can rebuild it on resize.
      onSplit: ((self: SplitText) => {
        const tween = gsap.from(self.lines, {
          yPercent: 110,
          duration: 1.05,
          ease: 'expo.out',
          stagger: 0.09,
          delay: opts.delay ?? 0,
          paused: opts.paused,
          scrollTrigger: scrollTrigger(el, opts.start),
        });
        tweens.push(tween);
        return tween;
      }) as unknown as (self: SplitText) => void,
    });
  });
  return tweens;
}

/** Paragraph resolves word by word from a faint, slightly lowered state. */
export function splitWordsReveal(targets: Targets, opts: RevealOptions = {}) {
  const tweens: gsap.core.Tween[] = [];
  gsap.utils.toArray<HTMLElement>(targets).forEach((el) => {
    SplitText.create(el, {
      type: 'words',
      autoSplit: true,
      onSplit: ((self: SplitText) => {
        const tween = gsap.from(self.words, {
          opacity: 0.08,
          y: 8,
          duration: opts.duration ?? 0.6,
          ease: 'power2.out',
          stagger: opts.stagger ?? 0.018,
          delay: opts.delay ?? 0,
          paused: opts.paused,
          scrollTrigger: scrollTrigger(el, opts.start),
        });
        tweens.push(tween);
        return tween;
      }) as unknown as (self: SplitText) => void,
    });
  });
  return tweens;
}

export { gsap, ScrollTrigger, SplitText };
