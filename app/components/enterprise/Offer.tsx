'use client';

import Field from './Field';
import { Section, Eyebrow, Reveal } from './primitives';

/**
 * The orientation section: states plainly what MAKERS3D does, who it is for,
 * and what you receive. Sits immediately under the hero so a first-time
 * visitor understands the business before scrolling any further.
 */
const PILLARS = [
  {
    index: '01',
    kicker: 'Send it over',
    title: 'A photo is enough to start',
    body: 'A phone photo is enough. Drawings and CAD files help, but we can work without them.',
  },
  {
    index: '02',
    kicker: 'We build it',
    title: 'Designed, printed, finished',
    body: 'We model it, print it on industrial machines, then paint and assemble it by hand until it looks like the real thing.',
  },
  {
    index: '03',
    kicker: 'It lands on your desk',
    title: 'Ready for the boardroom',
    body: 'A finished model ready to show, the CAD files in your name, and a line ready to scale when one becomes a thousand.',
  },
];

export default function Offer() {
  return (
    <Section className="relative overflow-hidden py-24 lg:py-36">
      <Field
        name="haze-a"
        className="inset-x-[-10%] top-[-20%] h-[120%] w-[120%]"
        opacity={0.30}
      />

      <div className="relative z-[1]">
        <Reveal>
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-end">
            <div>
              <Eyebrow>How it works</Eyebrow>
              <h2 className="m3-display mt-7 text-[clamp(2rem,4.6vw,3.5rem)] text-black">
                From photograph
                <br />
                to physical model.
              </h2>
            </div>
            <p className="m3-lede max-w-[520px] text-[15px] lg:justify-self-end">
              Most clients start with nothing but a photo. Three steps later they are
              holding a model of their machine — close enough that people reach out to
              touch it.
            </p>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-px border-t border-black/[0.08] lg:grid-cols-3">
          {PILLARS.map((p, i) => (
            <Reveal key={p.index} delay={i * 90}>
              <div className="group m3-morph relative h-full border-b border-black/[0.08] py-10 lg:border-b-0 lg:border-r lg:px-9 lg:first:pl-0 lg:last:border-r-0">
                <span className="absolute left-0 top-0 h-px w-0 bg-black/50 transition-[width] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-full lg:left-9 lg:group-hover:w-[calc(100%-2.25rem)] lg:first:group-hover:w-full" />

                <div className="flex items-baseline gap-4">
                  <span className="m3-eyebrow">{p.index}</span>
                  <span className="text-[11px] font-light uppercase tracking-[0.18em] text-black/30">
                    {p.kicker}
                  </span>
                </div>

                <h3 className="mt-7 text-[19px] font-light tracking-tight text-black lg:text-[21px]">
                  {p.title}
                </h3>

                <p className="m3-lede mt-4 max-w-[340px] text-[13px]">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
