import Image from 'next/image';
import { Section, Eyebrow, Reveal } from './primitives';

export default function Statement() {
  return (
    <Section id="our-approach" className="landing-section landing-space">
      <div className="grid items-center gap-8 sm:gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <Reveal>
          <Eyebrow>From idea to object</Eyebrow>
          <h2 className="lp-lines m3-display landing-heading mt-5 sm:mt-6">
            A good idea deserves<br /><span className="text-[#737373]">a real-world test.</span>
          </h2>
          <div className="lp-panel mt-6 max-w-[470px] sm:mt-7">
            <p className="landing-copy text-[14px] sm:text-[16px]">
              A screen can only tell you so much. A physical model helps you
              check the fit, explain the design and see what needs to change.
            </p>
            <p className="landing-copy mt-4 text-[14px] sm:text-[15px]">
              Bring a drawing, a CAD file or a reference photo. We help you
              work through the design, choose a print process and finish the
              piece for its purpose.
            </p>
          </div>
          <p className="mt-6 border-l-2 border-[#b77e61] pl-4 text-[13px] leading-relaxed text-[#595959] sm:mt-7">
            For product teams, model makers and people with a &ldquo;what if&rdquo;.
          </p>
        </Reveal>
        <Reveal delay={120}>
          <figure className="relative aspect-[6/5] overflow-hidden border border-black/[0.06] bg-white">
            <div className="lp-parallax absolute inset-0">
              <Image src="/images/landing/redesign/studio-prototyping.webp" alt="Enclosure prototypes, calipers and design drawings arranged on a white workbench" fill sizes="(max-width: 1023px) 100vw, 50vw" className="object-cover" />
            </div>
          </figure>
        </Reveal>
      </div>
    </Section>
  );
}
