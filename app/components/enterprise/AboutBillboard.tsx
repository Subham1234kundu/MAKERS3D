'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

// Match the four corners of the white face in the square billboard photograph.
const CORNERS = [
  [159 / 1024, 424 / 1024],
  [707 / 1024, 75 / 1024],
  [738 / 1024, 346 / 1024],
  [117 / 1024, 682 / 1024],
] as const;
const FACE_WIDTH = 1000;
const FACE_HEIGHT = 400;

function faceTransform(size: number) {
  const [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = CORNERS;
  const dx1 = x1 - x2, dx2 = x3 - x2, dx3 = x0 - x1 + x2 - x3;
  const dy1 = y1 - y2, dy2 = y3 - y2, dy3 = y0 - y1 + y2 - y3;
  const denominator = dx1 * dy2 - dx2 * dy1;
  const perspectiveX = (dx3 * dy2 - dx2 * dy3) / denominator;
  const perspectiveY = (dx1 * dy3 - dx3 * dy1) / denominator;
  const horizontalX = x1 - x0 + perspectiveX * x1;
  const horizontalY = y1 - y0 + perspectiveX * y1;
  const verticalX = x3 - x0 + perspectiveY * x3;
  const verticalY = y3 - y0 + perspectiveY * y3;

  return `matrix3d(${[
    horizontalX * size / FACE_WIDTH, horizontalY * size / FACE_WIDTH, 0, perspectiveX / FACE_WIDTH,
    verticalX * size / FACE_HEIGHT, verticalY * size / FACE_HEIGHT, 0, perspectiveY / FACE_HEIGHT,
    0, 0, 1, 0,
    x0 * size, y0 * size, 0, 1,
  ].join(',')})`;
}

export default function AboutBillboard() {
  const root = useRef<HTMLElement>(null);
  const face = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const element = root.current;
    if (!element) return;

    const alignFace = () => {
      if (face.current) face.current.style.transform = faceTransform(element.clientWidth);
    };
    alignFace();
    const resize = new ResizeObserver(alignFace);
    resize.observe(element);

    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const revealWithoutMotion = () => {
      if (preference.matches) setRevealed(true);
    };
    revealWithoutMotion();
    preference.addEventListener('change', revealWithoutMotion);

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setRevealed(true);
      observer.disconnect();
    }, { threshold: 0.35, rootMargin: '0px 0px -12% 0px' });
    observer.observe(element);

    return () => {
      resize.disconnect();
      observer.disconnect();
      preference.removeEventListener('change', revealWithoutMotion);
    };
  }, []);

  return (
    <figure
      ref={root}
      role="img"
      aria-label="MAKERS3D displayed on an outdoor billboard"
      className="relative m-0 h-full w-full overflow-hidden bg-black"
      data-about-billboard
      data-billboard-revealed={revealed}
    >
      <Image
        src="/images/billboard_frame_black.png"
        alt=""
        fill
        sizes="(max-width: 1023px) 100vw, 50vw"
        className="pointer-events-none object-contain"
      />
      <div
        ref={face}
        aria-hidden="true"
        className="absolute left-0 top-0 grid origin-top-left place-items-center overflow-hidden"
        style={{ width: FACE_WIDTH, height: FACE_HEIGHT }}
      >
        <svg viewBox="0 0 1000 400" width="1000" height="400" className="block overflow-hidden">
          <g
            className="transition-[opacity,transform] duration-[1200ms] ease-out motion-reduce:transition-none"
            style={{ opacity: revealed ? 1 : 0, transform: revealed ? 'translateY(0)' : 'translateY(24px)' }}
          >
            <text x="500" y="200" textAnchor="middle" dominantBaseline="central" fill="#111111" fontSize="132" fontWeight="800" letterSpacing="-5">MAKERS3D</text>
          </g>
        </svg>
      </div>
    </figure>
  );
}
