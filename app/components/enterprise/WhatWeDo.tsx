import Image from 'next/image';
import Link from 'next/link';
import { Section, Eyebrow, Reveal, Cta } from './primitives';

const CARDS = [
  {
    title: 'Custom scale models',
    hook: 'Big machines. Small, considered details.',
    body: 'Miniature machinery and presentation models for displays, demonstrations and gifting. Choose the scale, finish and moving features for your brief.',
    image: 'service-miniatures',
    alt: 'Yellow crawler crane miniature on a white display plinth',
    href: '/services#miniatures',
  },
  {
    title: 'Design & prototyping',
    hook: 'See how it feels before you make more.',
    body: 'CAD design and 3D printed prototypes to explore a product’s shape, fit and function. Refine the details while changes are still practical.',
    image: 'service-prototyping',
    alt: 'Open and assembled 3D printed electronics enclosure prototypes',
    href: '/services#design',
  },
  {
    title: 'Batch 3D printing',
    hook: 'A single sample can be the beginning.',
    body: 'Printed parts, model series and custom objects in the quantities your project needs. Plan the material, finish and production run with our team.',
    image: 'service-production',
    alt: 'A neatly arranged batch of charcoal 3D printed mounting brackets',
    href: '/services#bulk',
  },
];

export default function WhatWeDo() {
  return (
    <Section id="what-we-do" className="landing-section landing-space">
      <Reveal>
        <div className="landing-intro">
          <div>
            <Eyebrow>What we make possible</Eyebrow>
            <h2 className="lp-lines m3-display landing-heading mt-5 sm:mt-6">
              Your brief.<br /><span className="text-[#737373]">The right way to build it.</span>
            </h2>
          </div>
          <p className="lp-words landing-copy max-w-[620px] text-[14px] sm:text-[16px]">
            From a detailed miniature to a part that needs to fit,
            we shape the process around what you want to make.
          </p>
        </div>
      </Reveal>
      <div className="mt-8 grid gap-4 sm:mt-12 lg:grid-cols-3 lg:gap-[26px]">
        {CARDS.map((card, i) => (
          <Reveal key={card.title} delay={i * 90} className="lp-card">
            <Link href={card.href} className="group m3-morph flex h-full flex-col border border-black/[0.09] bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black">
              <div className="relative aspect-[16/10] overflow-hidden border-b border-black/[0.06] bg-white lg:aspect-[4/3]">
                <div className="lp-card-art absolute inset-0">
                  <Image src={`/images/landing/redesign/${card.image}.webp`} alt={card.alt} fill sizes="(max-width: 1023px) 100vw, 33vw" className="object-contain transition-[opacity,transform,filter] duration-[1600ms] ease-[cubic-bezier(0.16,1,0.3,1)] lg:scale-[1.06] group-hover:scale-100 group-hover:opacity-100 group-hover:blur-0" />
                </div>
              </div>
              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <span className="font-mono text-[11px] tracking-[0.15em] text-[#8a614d]">0{i + 1}</span>
                <h3 className="mt-3 text-[21px] font-normal tracking-tight text-black sm:mt-4 sm:text-[23px]">{card.title}</h3>
                <p className="mt-3 text-[14px] leading-relaxed text-[#404040] sm:text-[15px]">{card.hook}</p>
                <p className="landing-copy mt-3 text-[14px]">{card.body}</p>
                <span className="mt-auto flex items-center gap-3 pt-6 text-[11px] font-medium uppercase tracking-[0.16em] text-black">
                  Explore this service
                  <span className="h-px w-6 bg-current transition-[width] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-12" aria-hidden="true" />
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
      <Reveal delay={200} className="lp-fade">
        <div className="mt-6 flex flex-col items-center gap-4 text-center sm:mt-8 sm:flex-row sm:justify-between sm:text-left">
          <p className="text-[14px] leading-relaxed text-[#626262]">Need reverse engineering or a model with moving parts?</p>
          <Cta href="/services">View All Services</Cta>
        </div>
      </Reveal>
    </Section>
  );
}
