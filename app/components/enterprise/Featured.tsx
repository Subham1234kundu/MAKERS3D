import Image from 'next/image';
import { Section, Eyebrow, Reveal, Cta } from './primitives';

/**
 * Featured engagement — the Figma case-study band: portrait on the left, a
 * dark panel on the right carrying the quote, the person and a tag row.
 *
 * DEMO CONTENT: the engagement below is illustrative until a client signs off
 * on a named case study. Keep the "Demo engagement" label until then.
 */
const CASE = {
  quote:
    'We sent three photographs of our excavator. Two weeks later a 1:35 model was on the dealer’s desk, every decal in place. Customers pick it up before they open the brochure.',
  name: 'Operations Head',
  role: 'Heavy equipment dealer network',
  tags: ['Scale miniature', '1:35', 'Dealer network', '40 units'],
};

export default function Featured() {
  return (
    <Section className="py-0">
      <div className="grid lg:grid-cols-[0.42fr_0.58fr]">
        <Reveal className="lp-card">
          <div className="group relative aspect-[4/3] w-full overflow-hidden sm:aspect-[16/10] lg:aspect-[4/5]">
            <div className="lp-card-art absolute inset-0">
              <Image
                src="/images/landing/portrait.jpg"
                alt="Portrait of a partner operations lead who commissioned scale models from MAKERS3D"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="scale-[1.02] object-cover object-[center_25%] opacity-95 transition-[opacity,transform] duration-[1600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-100 group-hover:opacity-100"
              />
            </div>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="lp-panel m3-glass flex h-full flex-col justify-between p-6 sm:p-9 lg:p-14">
            <div>
              <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <Eyebrow>Featured engagement</Eyebrow>
                <span className="m3-eyebrow !text-[9px] !tracking-[0.2em] text-black/20">
                  Demo engagement
                </span>
              </div>

              <blockquote className="lp-words mt-10 text-[clamp(1.25rem,2.4vw,1.75rem)] font-light leading-snug tracking-tight text-black">
                &ldquo;{CASE.quote}&rdquo;
              </blockquote>
            </div>

            <div className="mt-12">
              <div className="border-t border-black/[0.08] pt-6">
                <div className="text-[14px] font-normal text-black">{CASE.name}</div>
                <div className="mt-1 text-[12px] font-light text-black/40">{CASE.role}</div>
              </div>

              <div className="lp-chips mt-6 flex flex-wrap gap-2">
                {CASE.tags.map((t) => (
                  <span
                    key={t}
                    className="bg-black/[0.055] px-3 py-1.5 text-[10px] font-light uppercase tracking-[0.18em] text-black/60"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="mt-8">
                <Cta href="/contact">Start yours</Cta>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
