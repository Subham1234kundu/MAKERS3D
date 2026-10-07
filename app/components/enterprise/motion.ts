import { gsap, headlineLinesReveal, splitWordsReveal } from '@/lib/gsap';

/**
 * Scroll choreography shared by every GSAP-driven page (LandingMotion,
 * PageMotion). Sections opt in with `lp-*` marker classes, so server
 * components never need to run GSAP themselves:
 *
 *   lp-lines     headline rises line by line out of a mask
 *   lp-words     paragraph resolves word by word
 *   lp-words-slow  the same, at an unhurried reading pace
 *   lp-eyebrow   (from <Eyebrow>) rule draws, label slides in
 *   lp-fade      plain rise-and-fade
 *   lp-card      rises; its .lp-card-art eases out of a slight zoom
 *   lp-media     image frame wipes open; its .lp-card-art settles from a zoom
 *   lp-chips     children deal in one at a time
 *   lp-stagger   children rise in sequence
 *   lp-tiles     children wipe up one at a time
 *   lp-panel     glass panel lifts and sharpens
 *   lp-rule      hairline draws across
 *   lp-parallax  backdrop plate drifts against the scroll
 *
 * Must run inside a gsap.context (useGSAP) so it is all reverted on unmount.
 */
export function scrollReveals(root: Element) {
  const q = (sel: string) => Array.from(root.querySelectorAll<HTMLElement>(sel));

  headlineLinesReveal(q('.lp-lines'), { start: 'top 88%' });
  splitWordsReveal(q('.lp-words'), { start: 'top 88%' });
  splitWordsReveal(q('.lp-words-slow'), { start: 'top 85%', duration: 1.2, stagger: 0.06 });

  q('.lp-eyebrow').forEach((eb) => {
    // Eyebrows in a hero or masthead belong to that intro timeline.
    if (eb.closest('.lp-hero-eyebrow, .lp-masthead')) return;
    gsap
      .timeline({ scrollTrigger: { trigger: eb, start: 'top 90%' } })
      .from(eb.querySelector('.lp-eyebrow-rule'), {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 0.8,
        ease: 'power3.out',
      })
      .from(
        eb.querySelector('.m3-eyebrow'),
        { x: -12, opacity: 0, duration: 0.8, ease: 'power3.out' },
        0.1,
      );
  });

  q('.lp-fade').forEach((node) => {
    gsap.from(node, {
      y: 32,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: { trigger: node, start: 'top 90%' },
    });
  });

  // Cards rise in as each row reaches the fold, with their artwork
  // easing out of a slight zoom behind the text.
  q('.lp-card').forEach((card) => {
    const siblings = Array.from(
      card.parentElement?.parentElement?.querySelectorAll('.lp-card') ?? [],
    );
    const i = Math.max(0, siblings.indexOf(card));
    const tl = gsap.timeline({
      scrollTrigger: { trigger: card, start: 'top 92%' },
      delay: (i % 3) * 0.1,
    });
    tl.fromTo(card, { y: 44, opacity: 0 }, { y: 0, opacity: 1, duration: 0.75, ease: 'power3.out' });
    const art = card.querySelector('.lp-card-art');
    if (art) tl.fromTo(art, { scale: 1.08 }, { scale: 1, duration: 1.2, ease: 'power2.out' }, 0);
  });

  // Image frames open like a shutter, the picture settling as it is uncovered.
  q('.lp-media').forEach((box) => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: box, start: 'top 85%' } });
    tl.fromTo(
      box,
      { clipPath: 'inset(0% 100% 0% 0%)' },
      { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'expo.inOut', clearProps: 'clipPath' },
    );
    const art = box.querySelector('.lp-card-art');
    if (art) tl.fromTo(art, { scale: 1.2 }, { scale: 1, duration: 1.6, ease: 'expo.out' }, 0.1);
  });

  // Chips deal in, so the row assembles rather than appearing whole. Chips
  // may carry .m3-morph, whose CSS transform transition would lag GSAP.
  q('.lp-chips').forEach((row) => {
    mute(row.children);
    gsap.fromTo(
      row.children,
      { y: 20, opacity: 0, scale: 0.92 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.55,
        ease: 'back.out(1.7)',
        stagger: 0.07,
        clearProps: 'transition',
        scrollTrigger: { trigger: row, start: 'top 92%' },
      },
    );
  });

  // Staggered groups: columns, list rows, steps, footer columns.
  q('.lp-stagger').forEach((group) => {
    gsap.from(group.children, {
      y: 36,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.1,
      scrollTrigger: { trigger: group, start: 'top 88%' },
    });
  });

  // Tiles arrive one at a time: each wipes up out of its cell and settles,
  // the next starting only as the last lands.
  q('.lp-tiles').forEach((grid) => {
    gsap.fromTo(
      grid.children,
      { clipPath: 'inset(100% 0% 0% 0%)', y: 40, opacity: 0 },
      {
        clipPath: 'inset(0% 0% 0% 0%)',
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: 'expo.out',
        stagger: 0.28,
        clearProps: 'clipPath',
        scrollTrigger: { trigger: grid, start: 'top 80%' },
      },
    );
  });

  q('.lp-rule').forEach((rule) => {
    gsap.from(rule, {
      scaleX: 0,
      transformOrigin: 'left center',
      duration: 1.2,
      ease: 'expo.out',
      scrollTrigger: { trigger: rule, start: 'top 92%' },
    });
  });

  q('.lp-panel').forEach((panel) => {
    gsap.from(panel, {
      y: 50,
      opacity: 0,
      scale: 0.96,
      filter: 'blur(8px)',
      duration: 1,
      ease: 'power3.out',
      clearProps: 'filter',
      scrollTrigger: { trigger: panel, start: 'top 88%' },
    });
  });

  q('.lp-parallax').forEach((plate) => {
    gsap.fromTo(
      plate,
      { yPercent: -6, scale: 1.1 },
      {
        yPercent: 6,
        scale: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: plate.parentElement ?? plate,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      },
    );
  });
}

/**
 * Turns off CSS transitions on targets so they don't fight GSAP. Pair with
 * `clearProps: 'transition'` on the tween to hand them back afterwards.
 */
export function mute(targets: gsap.TweenTarget) {
  gsap.set(targets, { transition: 'none' });
}

/** Reveals `lp-intro`, which CSS keeps hidden until GSAP takes over. */
export function unhideIntro(root: Element) {
  gsap.set(root.querySelectorAll('.lp-intro'), { visibility: 'visible' });
}
