'use client';

import { PROCESS } from './content';
import { Section, Eyebrow, Reveal } from './primitives';

/** Four-step engagement model, laid out as a ruled timeline. */
export default function Process() {
  return (
    <Section id="process" className="py-16 sm:py-24 lg:py-36">
      <Reveal>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <Eyebrow>How it runs</Eyebrow>
            <h2 className="lp-lines m3-display mt-7 text-[clamp(2rem,4.6vw,3.5rem)] text-black">
              Every layer agreed.
              <br />
              <span className="text-black/35">Nothing left to chance.</span>
            </h2>
          </div>
          <p className="lp-words m3-lede max-w-[520px] text-[15px] lg:justify-self-end">
            Price, timeline and finish are agreed before we start. Once you approve the
            model, nothing changes without your say-so.
          </p>
        </div>
      </Reveal>

      <div className="lp-stagger mt-10 grid border-t border-black/[0.08] sm:mt-16 sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-4 lg:gap-x-0">
        {PROCESS.map((step, i) => (
          <Reveal key={step.index} delay={i * 90}>
            <div className="group m3-morph relative h-full border-b border-black/[0.08] py-8 pr-8 sm:py-10 lg:border-b-0 lg:border-r lg:px-8 lg:first:pl-0">
              {/* Progress node sitting on the rule */}
              <span className="absolute left-0 top-0 h-px w-0 bg-black/60 transition-[width] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-full lg:left-8 lg:group-hover:w-[calc(100%-2rem)]" />

              <span className="m3-eyebrow">Step {step.index}</span>

              <h3 className="mt-8 text-[18px] font-light tracking-tight text-black">
                {step.title}
              </h3>

              <p className="m3-lede mt-4 text-[13px]">{step.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
