'use client';

import HeroMaking from './HeroMaking';
import { Cta } from './primitives';

const HIGHLIGHTS = [
  { value: 'Custom scale models', label: 'Details that tell your story', note: 'Display pieces and models with moving parts.' },
  { value: 'Working prototypes', label: 'Hold it. Test it. Refine it.', note: 'Explore form and fit before committing to tooling.' },
  { value: 'Production batches', label: 'From one part to a series', note: 'Discuss materials, quantities and finishes with our team.' },
  { value: 'Made in India', label: 'Design through to finishing', note: 'One conversation, from your brief to the physical piece.' },
];

export default function Hero() {
  return (
    <section aria-label="Custom 3D printing and scale models" className="landing-hero relative overflow-clip bg-white pt-[72px]">
      <div className="m3-rails" aria-hidden="true" />
      <div className="lp-hero-beam pointer-events-none absolute inset-0 bg-white" aria-hidden="true" />
      <div data-hero-stage className="m3-shell relative z-[1] grid items-center gap-6 pb-12 pt-4 sm:gap-8 sm:pb-16 sm:pt-8 lg:min-h-[650px] lg:grid-cols-[1fr_1fr] lg:gap-16 lg:py-16">
        <div className="landing-hero-copy contents lg:block lg:w-full lg:max-w-[620px]">
          <h1 className="lp-hero-title m3-display landing-title row-start-1 text-[clamp(2.5rem,5.5vw,4.75rem)] text-black lg:row-auto">
            Big ideas.<br /><span className="text-[#6b6b6b]">Built in 3D.</span>
          </h1>
          <div className="landing-hero-details row-start-3 lg:row-auto">
            <p className="lp-hero-lede landing-copy max-w-[490px] text-[14px] sm:text-[16px] lg:mt-8">
              Custom 3D printing, scale models and product prototyping in India.
              We turn your sketches and files into something you can hold, test
              and show off. You bring the idea. We handle the layers.
            </p>
            <div className="lp-hero-cta mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-3">
              <Cta href="/collections" tone="solid" className="min-h-12 justify-between !px-6 !py-3 sm:justify-start sm:!px-8 sm:!py-4">Our Collection</Cta>
              <Cta href="/services" className="min-h-12 justify-between !px-6 !py-3 sm:justify-start sm:!px-8 sm:!py-4">Explore Services</Cta>
            </div>
            <ul className="lp-hero-list mt-6 flex flex-wrap gap-x-5 gap-y-2 sm:mt-8">
              {['Scale models', 'Printed parts', 'Product design'].map((item) => (
                <li key={item} className="flex items-center gap-2 text-[12px] leading-relaxed text-[#626262]">
                  <span className="h-1 w-1 shrink-0 bg-[#a16b50]" aria-hidden="true" />{item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div data-hero-runway className="relative row-start-2 w-full lg:row-auto">
          <div data-hero-visual className="relative mx-auto w-full max-w-[340px] sm:max-w-[420px] lg:max-w-none">
            <div className="lp-hero-art relative">
              <HeroMaking />
            </div>
          </div>
        </div>
      </div>
      <div className="relative z-[2] border-t border-black/[0.08] bg-white">
        <div className="m3-shell grid grid-cols-2 lg:grid-cols-4">
          {HIGHLIGHTS.map((item, i) => (
            <div key={item.value} className={[
              'lp-hero-metric m3-morph group py-5 sm:py-6',
              i < 2 ? 'border-b border-black/[0.08] lg:border-b-0' : '',
              i % 2 === 1 ? 'border-l border-black/[0.08] pl-5 lg:pl-6' : 'pr-4 lg:pr-6',
              i === 2 ? 'lg:border-l lg:border-black/[0.08] lg:pl-6' : '',
            ].join(' ')}>
              <div className="text-[14px] font-medium leading-snug tracking-tight text-black sm:text-[17px]">{item.value}</div>
              <div className="mt-2 max-w-[190px] text-[12px] leading-relaxed text-[#666]">{item.label}</div>
              <div className="mt-2 hidden max-w-[225px] text-[11px] leading-relaxed text-[#777] opacity-0 transition-opacity duration-700 group-hover:opacity-100 lg:block">{item.note}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

