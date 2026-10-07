'use client';

import Field from './Field';
import { Reveal, Cta } from './primitives';

/** Closing conversion band. One primary action, stated plainly. */
export default function Contact() {
  return (
    <section className="relative overflow-hidden border-t border-black/[0.08]">
      <div className="m3-blueprint absolute inset-0 opacity-70" aria-hidden="true" />
      <Field
        name="lattice"
        className="inset-x-[-5%] top-[-15%] h-[130%] w-[110%]"
        opacity={0.34}
      />
      <div className="m3-rails" aria-hidden="true" />

      <div className="m3-shell relative z-[1] py-20 sm:py-28 lg:py-40">
        <Reveal>
          <div className="mx-auto max-w-[840px] text-center">
            <div className="lp-fade flex items-center justify-center gap-4">
              <span className="h-px w-8 bg-black/20" />
              <span className="m3-eyebrow">Start here</span>
              <span className="h-px w-8 bg-black/20" />
            </div>

            <h2 className="lp-lines m3-display mt-9 text-[clamp(2.25rem,6vw,4.25rem)] text-black">
              Send one photo.
              <br />
              <span className="text-black/35">We&rsquo;ll handle every layer.</span>
            </h2>

            <p className="lp-words m3-lede mx-auto mt-8 max-w-[560px] text-[15px]">
              One photo is enough to start. You get back how we would build it, at what
              scale, in what material and what it costs. No obligation.
            </p>

            <div className="lp-fade mt-10 flex flex-col gap-3 sm:mt-12 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-4">
              <Cta href="/contact" tone="solid" className="justify-between sm:justify-start">
                Get a Free Quote
              </Cta>
              <Cta href="/partner" className="justify-between sm:justify-start">
                Partner with us
              </Cta>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
