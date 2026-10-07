'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Component, useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { gsap, LOADED_EVENT, ScrollTrigger } from '@/lib/gsap';
import type { PrintFrame } from './HeroPrintScene';

const PrintScene = dynamic(() => import('./HeroPrintScene'), { ssr: false });

// Client route changes retain this module; a full page refresh resets it.
let desktopPrintCompleted = false;

/** Desktop plays once until refresh; mobile prints once per visit with scrolling. */
export default function HeroMaking() {
  const root = useRef<HTMLElement>(null);
  const photo = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLDivElement>(null);
  const photoLoaded = useRef(false);
  const progress = useRef(0);
  const playbackMode = useRef<'auto' | 'scroll'>('scroll');
  const completed = useRef(false);
  const scroll = useRef<ScrollTrigger | null>(null);
  const completionFrame = useRef(0);
  const [animate, setAnimate] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [ready, setReady] = useState(false);
  const [finished, setFinished] = useState(false);
  const [visit, setVisit] = useState(0);
  const [visible, setVisible] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);
  const [playback, setPlayback] = useState<'auto' | 'scroll'>('scroll');

  const showPhoto = useCallback(() => {
    if (photo.current) photo.current.style.opacity = '1';
    if (canvas.current) canvas.current.style.opacity = '0';
  }, []);

  const finishPrint = useCallback(() => {
    if (completed.current) return;
    completed.current = true;
    if (playbackMode.current === 'auto') desktopPrintCompleted = true;
    progress.current = 1;
    showPhoto();
    setFinished(true);

    scroll.current?.kill();
    scroll.current = null;
    // Keep the mobile runway in place: the finished photo scrolls out naturally.
  }, [showPhoto]);

  const completeWhenReady = useCallback(() => {
    if (progress.current < 1 || !photoLoaded.current || completed.current || completionFrame.current) return;
    completionFrame.current = requestAnimationFrame(() => {
      completionFrame.current = 0;
      finishPrint();
    });
  }, [finishPrint]);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let webglAvailable: boolean | undefined;
    const updateMotion = () => {
      const desktop = window.matchMedia('(min-width: 1024px)').matches;
      playbackMode.current = desktop ? 'auto' : 'scroll';
      setPlayback(playbackMode.current);
      if (desktop && desktopPrintCompleted) {
        setAnimate(false);
        finishPrint();
        return;
      }
      if (preference.matches) {
        setAnimate(false);
        showPhoto();
        if (scroll.current) finishPrint();
        return;
      }
      if (webglAvailable === undefined) {
        try {
          const context = document.createElement('canvas').getContext('webgl2');
          webglAvailable = Boolean(context);
          context?.getExtension('WEBGL_lose_context')?.loseContext();
        } catch {
          webglAvailable = false;
        }
      }
      setAnimate(webglAvailable);
    };
    const start = () => setLoaded(true);
    const updateVisibility = () => setTabVisible(!document.hidden);
    const restartOnRestore = (event: PageTransitionEvent) => {
      if (!event.persisted) return;
      if (window.matchMedia('(min-width: 1024px)').matches) {
        if (desktopPrintCompleted) finishPrint();
        return;
      }
      cancelAnimationFrame(completionFrame.current);
      completionFrame.current = 0;
      scroll.current?.kill();
      scroll.current = null;
      completed.current = false;
      progress.current = 0;
      setFinished(false);
      setReady(false);
      setVisit(value => value + 1);
      showPhoto();
      window.scrollTo({ top: 0, behavior: 'instant' });
    };
    updateMotion();
    updateVisibility();
    if (window.__m3Loaded) start();
    else window.addEventListener(LOADED_EVENT, start);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.15 });
    if (root.current) observer.observe(root.current);
    preference.addEventListener('change', updateMotion);
    document.addEventListener('visibilitychange', updateVisibility);
    window.addEventListener('pageshow', restartOnRestore);
    return () => {
      observer.disconnect();
      preference.removeEventListener('change', updateMotion);
      window.removeEventListener(LOADED_EVENT, start);
      document.removeEventListener('visibilitychange', updateVisibility);
      window.removeEventListener('pageshow', restartOnRestore);
    };
  }, [showPhoto, finishPrint]);

  useEffect(() => {
    if (!loaded || !ready || !root.current) return;
    const hero = root.current.closest('.landing-hero');
    const runway = hero?.querySelector<HTMLElement>('[data-hero-runway]');
    const visual = hero?.querySelector<HTMLElement>('[data-hero-visual]');
    if (!runway || !visual) return;

    const media = gsap.matchMedia();
    media.add({ desktop: '(min-width: 1024px)', mobile: '(max-width: 1023px)' }, (context) => {
      const desktop = Boolean(context.conditions?.desktop);
      playbackMode.current = desktop ? 'auto' : 'scroll';
      setPlayback(playbackMode.current);
      if (desktop) {
        if (desktopPrintCompleted) finishPrint();
        else if (completed.current) desktopPrintCompleted = true;
        return;
      }
      if (completed.current) return;

      const measure = () => {
        const distance = Math.max(420, window.innerHeight * 0.65);
        runway.style.setProperty('--hero-visual-height', `${visual.offsetHeight}px`);
        runway.style.setProperty('--hero-scroll-distance', `${distance}px`);
        runway.style.setProperty('--hero-scroll-hold', '96px');
        return distance;
      };
      measure();
      runway.setAttribute('data-scroll-active', '');
      const observer = new ResizeObserver(measure);
      observer.observe(visual);
      window.addEventListener('resize', measure);
      scroll.current = ScrollTrigger.create({
        id: 'hero-print',
        trigger: runway,
        start: 'top 88px',
        end: () => `+=${measure()}`,
        invalidateOnRefresh: true,
        refreshPriority: 1,
        onUpdate: (self) => {
          if (completed.current) return;
          progress.current = self.progress;
          completeWhenReady();
        },
      });
      progress.current = scroll.current.progress;
      completeWhenReady();
      return () => {
        observer.disconnect();
        window.removeEventListener('resize', measure);
        scroll.current?.kill();
        scroll.current = null;
        runway.removeAttribute('data-scroll-active');
        runway.style.removeProperty('--hero-visual-height');
        runway.style.removeProperty('--hero-scroll-distance');
        runway.style.removeProperty('--hero-scroll-hold');
      };
    });
    ScrollTrigger.refresh();

    return () => {
      cancelAnimationFrame(completionFrame.current);
      completionFrame.current = 0;
      media.revert();
      scroll.current = null;
    };
  }, [loaded, ready, visit, completeWhenReady, finishPrint]);

  const onFrame = useCallback(({ blend }: PrintFrame) => {
    if (completed.current) return;
    const photoOpacity = photoLoaded.current ? blend : 0;
    if (photo.current) photo.current.style.opacity = String(photoOpacity);
    if (canvas.current) canvas.current.style.opacity = String(1 - photoOpacity);
  }, []);

  const onUnavailable = useCallback(() => {
    setAnimate(false);
    finishPrint();
  }, [finishPrint]);

  const onReady = useCallback(() => setReady(true), []);

  return (
    <figure ref={root} className="relative" data-hero-sequence={finished ? 'complete' : animate ? playback : 'static'} aria-label={finished || !animate ? 'Finished 3D printed terracotta vase' : playback === 'scroll' ? 'Scroll to print a digital vase layer by layer and reveal the finished product' : 'A digital vase prints layer by layer and becomes the finished product'}>
      <div className="relative aspect-square w-full overflow-hidden bg-white">
        <div ref={photo} className="absolute inset-0 px-[10%] py-[6%]" data-hero-product>
          <Image
            src="/images/landing/redesign/hero-vase.webp"
            alt="Finished terracotta vase with spiral ribs and fine 3D printed layers"
            fill
            priority
            sizes="(max-width: 639px) 100vw, (max-width: 1023px) 520px, 50vw"
            className="object-contain p-[8%]"
            onLoad={() => { photoLoaded.current = true; completeWhenReady(); }}
          />
        </div>
        <div ref={canvas} className="absolute inset-0" style={{ opacity: 0 }} aria-hidden="true" data-hero-print>
          {animate && !finished && (
            <SceneBoundary key={visit} onUnavailable={onUnavailable}>
              <PrintScene active={loaded && visible && tabVisible} playback={playback} progress={progress} onFrame={onFrame} onComplete={completeWhenReady} onReady={onReady} onUnavailable={onUnavailable} />
            </SceneBoundary>
          )}
        </div>
      </div>
    </figure>
  );
}

class SceneBoundary extends Component<{ children: ReactNode; onUnavailable: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onUnavailable(); }
  render() { return this.state.failed ? null : this.props.children; }
}
