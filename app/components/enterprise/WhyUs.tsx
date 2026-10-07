import Image from 'next/image';
import { Section, Eyebrow, Reveal } from './primitives';

const REASONS = [
  { title: 'Designed for the job', body: 'We start with how your piece will be used, then discuss the geometry, material and finish that suit it.' },
  { title: 'Room to refine', body: 'A prototype makes the next decision easier. Check the form and fit, then adjust the design before the next version.' },
  { title: 'Details that matter', body: 'Scale, assembly and surface finish all shape the result. We discuss those details as part of your project brief.' },
];

export default function WhyUs() {
  return (
    <Section id="why-makers3d" className="landing-section landing-space">
      <Reveal>
        <div className="landing-intro">
          <Eyebrow>Layer by layer.</Eyebrow>
          <h2 className="lp-lines m3-display landing-heading mt-1 sm:mt-2">
            The details make<br /><span className="text-[#737373]">the difference.</span>
          </h2>
        </div>
      </Reveal>
      <div className="mt-8 grid items-center gap-8 sm:mt-12 sm:gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
        <div className="lp-stagger divide-y divide-black/[0.09] border-y border-black/[0.09]">
          {REASONS.map((reason, i) => (
            <Reveal key={reason.title} delay={i * 90}>
              <div className="group m3-morph relative grid grid-cols-[24px_1fr] gap-3 py-5 sm:grid-cols-[28px_1fr] sm:gap-4 sm:py-6">
                <span className="absolute left-0 top-0 h-px w-0 bg-black/50 transition-[width] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-full" aria-hidden="true" />
                <span className="pt-1 font-mono text-[11px] text-[#8a614d]">0{i + 1}</span>
                <div>
                  <h3 className="text-[17px] font-normal tracking-tight sm:text-[18px]">{reason.title}</h3>
                  <p className="landing-copy mt-2 max-w-[420px] text-[14px]">{reason.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={120} className="lp-card">
          <figure className="border border-black/[0.08] bg-white">
            <div className="relative aspect-[5/4] overflow-hidden">
              <div className="lp-card-art absolute inset-0">
                <Image src="/images/landing/redesign/quality-detail.webp" alt="Digital calipers beside two grey 3D printed mechanical housings" fill sizes="(max-width: 1023px) 100vw, 50vw" className="object-cover" />
              </div>
            </div>
            <figcaption className="border-t border-black/[0.08] px-5 py-4 text-[13px] leading-relaxed text-[#626262] sm:px-6 sm:py-5">
              Good results start with a clear brief: purpose, dimensions, material and finish.
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </Section>
  );
}
