'use client';

import { CAPABILITIES } from './content';
import Field from './Field';
import { Section, Eyebrow, Reveal, Cta } from './primitives';

/**
 * Capability grid. Hairline dividers rather than cards — no radius, no
 * shadow, structure carried entirely by the grid itself.
 */
export default function Capabilities() {
  return (
    <Section id="what-we-serve" className="relative overflow-hidden py-24 lg:py-36">
      <Field
        name="beam-b"
        className="inset-y-0 left-[-25%] w-[85%]"
        opacity={0.22}
      />

      <Reveal>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <Eyebrow>What we serve</Eyebrow>
            <h2 className="m3-display mt-7 text-[clamp(2rem,4.6vw,3.5rem)] text-black">
              Everything we make,
              <br />
              under one roof.
            </h2>
          </div>
          <p className="m3-lede max-w-[520px] text-[15px] lg:justify-self-end">
            No outsourcing. Design, printing, painting and checking all happen in our
            own studio — which is why what we promise is what arrives.
          </p>
        </div>
      </Reveal>

      <div className="mt-16 grid border-l border-t border-black/[0.08] sm:grid-cols-2 lg:grid-cols-3">
        {CAPABILITIES.map((cap, i) => (
          <Reveal key={cap.index} delay={i * 70}>
            <article className="group m3-morph m3-sheen relative h-full border-b border-r border-black/[0.08] p-8 hover:bg-black/[0.02] lg:p-10">
              <div className="flex items-start justify-between">
                <span className="m3-eyebrow">{cap.index}</span>
                <span className="h-px w-6 bg-black/15 transition-[width,background-color] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-12 group-hover:bg-black/50" />
              </div>

              <h3 className="mt-10 text-[19px] font-light tracking-tight text-black lg:text-[21px]">
                {cap.title}
              </h3>

              <p className="m3-lede mt-4 text-[13px]">{cap.summary}</p>

              <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2">
                {cap.detail.map((d) => (
                  <li
                    key={d}
                    className="text-[10px] font-light uppercase tracking-[0.16em] text-black/25 transition-colors duration-700 group-hover:text-black/45"
                  >
                    {d}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal delay={120}>
        <div className="mt-14 flex flex-wrap items-center gap-6">
          <Cta href="/services" tone="solid">
            See Everything We Serve
          </Cta>
          <Cta href="/contact">Get a Free Quote</Cta>
        </div>
      </Reveal>
    </Section>
  );
}
