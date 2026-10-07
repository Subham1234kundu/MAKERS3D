'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';

const SLIDES = [
  { src: '/images/partner/JhelPartner.png', alt: 'Jhel partner project' },
  { src: '/images/partner/3ddesignpartner.png', alt: '3D design partner project' },
  { src: '/images/partner/shiva3d.png', alt: 'Shiva 3D model' },
];

export default function PartnerSlideshow() {
  const root = useRef<HTMLDivElement>(null);
  const previousIndex = useRef(0);
  const timer = useRef<gsap.core.Tween | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!root.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, { threshold: 0.25 });
    observer.observe(root.current);
    return () => observer.disconnect();
  }, []);

  useGSAP(() => {
    if (!root.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const slides = root.current.querySelectorAll<HTMLElement>('[data-partner-slide]');
    gsap.set(slides, { xPercent: 0, autoAlpha: 0, zIndex: 0 });
    gsap.set(slides[previousIndex.current], { autoAlpha: 1, zIndex: 1 });
    gsap.fromTo(slides[activeIndex],
      { xPercent: 100, autoAlpha: 1, zIndex: 2 },
      { xPercent: 0, duration: 0.65, ease: 'power3.inOut' },
    );
  }, { scope: root, dependencies: [activeIndex] });

  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    timer.current = gsap.to({}, {
      duration: 4,
      paused: true,
      onComplete: () => {
        previousIndex.current = activeIndex;
        setActiveIndex((index) => (index + 1) % SLIDES.length);
      },
    });
    return () => { timer.current = null; };
  }, { scope: root, dependencies: [activeIndex] });

  useEffect(() => {
    if (isVisible) timer.current?.play();
    else timer.current?.pause();
  }, [activeIndex, isVisible]);

  return (
    <div ref={root} className="relative mt-10 aspect-[4/3] w-full overflow-hidden border border-black/[0.08] bg-black/[0.02] sm:mt-14 sm:aspect-[16/7]">
      {SLIDES.map((slide, index) => (
        <div
          key={slide.src}
          data-partner-slide
          className="absolute inset-0 bg-white"
          style={{
            visibility: index === 0 ? 'visible' : 'hidden',
            zIndex: index === 0 ? 1 : 0,
          }}
        >
          <div className="absolute inset-0">
            <Image src={slide.src} alt={slide.alt} fill sizes="100vw" loading="eager" className="object-cover object-center" />
          </div>
        </div>
      ))}
    </div>
  );
}
