import type { Metadata } from 'next';
import Image from 'next/image';

import EnterpriseNav from '../components/enterprise/EnterpriseNav';
import EnterpriseFooter from '../components/enterprise/EnterpriseFooter';
import PartnerForm from '../components/enterprise/PartnerForm';
import PartnerSlideshow from '../components/enterprise/PartnerSlideshow';
import GrowthGraphic from '../components/enterprise/GrowthGraphic';
import Field from '../components/enterprise/Field';
import PageMotion from '../components/enterprise/PageMotion';
import { Section, Reveal, Eyebrow, Cta } from '../components/enterprise/primitives';

const TITLE = 'Partner With Us | White-Label 3D Printing & Scale Models';

const DESCRIPTION =
  'Partner with MAKERS3D as a reseller, design studio, architecture practice or OEM. White-label 3D printing, scale models and production capacity — we build, you deliver.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    '3D printing partner India',
    'white label 3D printing',
    'scale model manufacturing partner',
    'reseller 3D printing services',
    'OEM model manufacturing',
  ],
  alternates: { canonical: 'https://makers3d.in/partner' },
  openGraph: {
    type: 'website',
    url: 'https://makers3d.in/partner',
    siteName: 'MAKERS3D',
    title: TITLE,
    description: DESCRIPTION,
    locale: 'en_IN',
  },
};

/** Hero triptych with the website logo in the centre panel. */
const HERO_BAND = [
  { src: '/images/partner/hero-1.jpg', alt: 'Partner team agreeing a project with MAKERS3D' },
  { src: '/images/logo.png', alt: 'MAKERS3D logo' },
  { src: '/images/partner/hero-3.jpg', alt: 'Design studio reviewing a model build with MAKERS3D' },
];

/** Sector ticker running under the hero, as in the Figma layout. */
const TICKER = [
  'Heavy Machinery',
  'Automotive',
  'Architecture',
  'Jewellery',
  'Product Design',
  'Exhibition',
  'Corporate Gifting',
  'Education',
  'Defence',
  'Real Estate',
];

/** Three cards, first one inverted — matching the Figma feature card. */
const WHY = [
  {
    title: 'You stay in the client seat',
    kicker: 'We handle the build. You focus on the relationship.',
    featured: true,
  },
  {
    title: 'Your promises get delivered',
    kicker: 'Clients see finished models, not production excuses.',
    featured: false,
  },
  {
    title: 'We understand your business',
    kicker: 'We start by learning your clients and your deadlines.',
    featured: false,
  },
];

/** Alternating image / text rows — the Figma "How We Partner" zigzag. */
const HOW = [
  {
    lead: 'You brief,',
    emphasis: 'we estimate',
    body: 'Send the requirement, a drawing or a photo. We come back with a technical estimate, a scale, a material and a firm timeline you can quote against.',
    image: '/images/partner/brief-estimate-art.png',
    alt: 'Artistic silver scale model developing from technical drawings and material samples',
  },
  {
    lead: 'You retain the',
    emphasis: 'client relationship',
    body: 'We are a contractor in your engagement. Your client sees you as the lead. We build to your direction and stay out of the room unless you want us in it.',
    image: '/images/partner/partner-2.jpg',
    alt: 'Partner presenting finished work to their own client',
  },
  {
    lead: 'We scale with',
    emphasis: 'your throughput',
    body: 'One model a quarter or fifty a month. Partner work sits ahead of the general queue, so your deadline never becomes a manufacturing problem.',
    image: '/images/partner/partner-3.jpg',
    alt: 'Production floor scaling a batch run',
  },
];

export default function PartnerPage() {
  return (
    <main className="m3-page min-h-screen bg-white text-black antialiased">
      <PageMotion>
        <EnterpriseNav />

        {/* ---------------- Hero: split headline over a full-bleed triptych ------- */}
        <section className="lp-masthead lp-intro relative overflow-hidden pt-[72px]">
          <div className="m3-blueprint absolute inset-0" aria-hidden="true" />
          <div className="m3-rails" aria-hidden="true" />
          <Field name="beam-a" className="lp-masthead-field inset-y-0 right-[-20%] w-[75%]" opacity={0.3} priority />

          <div className="m3-shell relative z-[1] grid gap-8 pb-12 pt-16 sm:pb-16 sm:pt-20 lg:max-w-[1440px] lg:grid-cols-[minmax(0,716fr)_minmax(0,512fr)] lg:items-end lg:gap-8 lg:!px-[6.25%] lg:pb-[94px] lg:pt-[118px]">
            <div className="relative">
              <h1 className="lp-masthead-title m3-display max-w-[716px] text-[clamp(2.25rem,3.93vw,3.5375rem)] !leading-[1.2014] text-black lg:h-[199px] lg:!tracking-[-2px]">
                Your clients dream it.
                <br />
                <span className="text-black/35">We print it, layer by&nbsp;layer,</span>
                <br />
                behind your name.
              </h1>
            </div>

            <p className="lp-masthead-lede m3-lede max-w-[512px] text-[15.1px] !leading-6 lg:mb-[4px] lg:min-h-[113px] lg:justify-self-end">
              MAKERS3D is the execution partner for studios, resellers and dealers. You win
              the work and keep the client. We design, print and finish the models your
              clients asked you for.
            </p>
          </div>

          {/* Triptych — 480x550 frames in Figma, edge to edge */}
          <div className="lp-masthead-band relative z-[1] grid border-t border-black/[0.08] sm:grid-cols-3">
            {HERO_BAND.map((img, i) => (
              <div
                key={img.src}
                className={`group relative overflow-hidden ${i === 1 ? 'bg-black' : 'bg-black/[0.02]'} ${
                  i === 1 ? 'aspect-[4/3] sm:aspect-[480/550]' : 'hidden aspect-[480/550] sm:block'
                } ${
                  i < 2 ? 'border-black/[0.08] sm:border-r' : ''
                }`}
              >
                <div className={i === 1
                  ? 'absolute left-1/2 top-[58%] aspect-square w-[65%] -translate-x-1/2 -translate-y-1/2 sm:w-[84%]'
                  : 'lp-card-art absolute inset-0'}>
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes={i === 1 ? '(max-width: 640px) 65vw, 28vw' : '(max-width: 640px) 100vw, 33vw'}
                    priority={i === 0}
                    className={i === 1 ? 'object-contain' : 'object-cover transition-transform duration-[1600ms] ease-[cubic-bezier(0.16,1,0.3,1)]'}
                  />
                </div>

                {i === 1 && (
                  <div className="absolute right-[25px] top-[25px] flex items-center gap-[11px] text-white">
                    <span className="text-[15px] font-medium uppercase tracking-[0.3em]">
                      Makers3D
                    </span>
                    <span className="text-[15px] font-light">&times;</span>
                    <span className="text-[15px] font-medium uppercase tracking-[0.3em]">
                      You
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ---------------- Sector ticker ---------------------------------------- */}
        <section className="relative overflow-hidden border-y border-black/[0.08] py-6">
          <div className="lp-fade relative flex select-none">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-[2]"
              style={{
                background:
                  'linear-gradient(90deg, #fff 0%, transparent 10%, transparent 90%, #fff 100%)',
              }}
            />
            {[0, 1].map((copy) => (
              <div
                key={copy}
                aria-hidden={copy === 1}
                className="m3-drift-slow flex shrink-0 items-center"
              >
                {[...TICKER, ...TICKER].map((t, i) => (
                  <span key={`${copy}-${t}-${i}`} className="flex items-center">
                    <span className="whitespace-nowrap px-8 text-[11px] font-light uppercase tracking-[0.3em] text-black/30">
                      {t}
                    </span>
                    <span className="h-1 w-1 shrink-0 bg-black/20" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* ---------------- Why Partner With MAKERS3D ---------------------------- */}
        <Section className="relative overflow-hidden py-16 sm:py-24 lg:py-32">
          <div className="relative z-[1]">
            <Reveal>
              <h2 className="lp-lines m3-display text-[clamp(2rem,4.6vw,3.5rem)] text-black">
                Your name up front.
                <br />
                <span className="text-black/35">Our layers underneath.</span>
              </h2>
            </Reveal>

            <div className="mt-10 grid border-l border-t border-black/[0.08] sm:mt-14 md:grid-cols-3">
              {WHY.map((w, i) => (
                <Reveal key={w.title} delay={i * 90} className="lp-card">
                  <article
                    className={`group m3-morph m3-sheen flex h-full min-h-[200px] flex-col justify-end border-b border-r border-black/[0.08] p-7 sm:min-h-[300px] sm:p-9 lg:p-11 ${
                      w.featured ? 'bg-black text-white' : 'hover:bg-black/[0.02]'
                    }`}
                  >
                    {/* Figma places a line-art glyph at the top of each card */}
                    <CardGlyph index={i} featured={w.featured} />

                    <p
                      className={`mt-auto text-[12px] font-light leading-relaxed ${
                        w.featured ? 'text-white/55' : 'text-black/35'
                      }`}
                    >
                      {w.kicker}
                    </p>

                    <h3
                      className={`mt-4 text-[19px] font-light leading-snug tracking-tight lg:text-[22px] ${
                        w.featured ? 'text-white' : 'text-black'
                      }`}
                    >
                      {w.title}
                    </h3>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </Section>

        {/* ---------------- What We Build ---------------------------------------- */}
        <Section className="py-16 sm:py-24 lg:py-32">
          <Reveal>
            <h2 className="lp-lines m3-display text-[clamp(2rem,4.6vw,3.5rem)] text-black">
              Models that
              <br />
              <span className="text-black/35">close the deal.</span>
            </h2>
          </Reveal>

          <Reveal delay={80}>
            <div className="mt-8 grid gap-6 sm:mt-12 sm:gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
              <h3 className="lp-lines text-[clamp(1.25rem,2.6vw,1.875rem)] font-light leading-snug tracking-tight text-black">
                Physical models that turn your recommendation
                <br className="hidden lg:block" /> into something the client can hold.
              </h3>
              <p className="lp-words m3-lede max-w-[420px] text-[14px] lg:justify-self-end lg:text-right">
                Scale miniatures, functional prototypes and production runs — built to your
                specification and delivered unbranded, ready to present as your own.
              </p>
            </div>
          </Reveal>

          <Reveal delay={140}>
            <PartnerSlideshow />
          </Reveal>
        </Section>

        {/* ---------------- How We Partner (alternating rows) -------------------- */}
        <Section className="py-16 sm:py-24 lg:py-32">
          <Reveal>
            <h2 className="lp-lines m3-display text-[clamp(2rem,4.6vw,3.5rem)] text-black">
              How the layers
              <br />
              <span className="text-black/35">come together.</span>
            </h2>
          </Reveal>

          <div className="mt-10 space-y-14 sm:mt-16 sm:space-y-20 lg:space-y-28">
            {HOW.map((row, i) => (
              <Reveal key={row.emphasis} delay={60}>
                <div className="grid items-center gap-6 md:grid-cols-2 md:gap-10 lg:gap-16">
                  <div
                    className={`lp-media group relative aspect-[635/331] w-full overflow-hidden border border-black/[0.08] bg-black/[0.02] ${
                      i % 2 === 1 ? 'md:order-2' : ''
                    }`}
                  >
                    {i === 2 ? (
                      <div className="lp-card-art absolute inset-0">
                        <GrowthGraphic />
                      </div>
                    ) : (
                      <div className="lp-card-art absolute inset-0">
                        <Image
                          src={row.image}
                          alt={row.alt}
                          fill
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          className="scale-[1.02] object-cover transition-transform duration-[1600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-100"
                        />
                      </div>
                    )}
                  </div>

                  <div className={i % 2 === 1 ? 'md:order-1' : ''}>
                    <h3 className="lp-lines text-[clamp(1.25rem,2.4vw,1.75rem)] font-light tracking-tight">
                      <span className="text-black/35">{row.lead} </span>
                      <span className="font-normal text-black">{row.emphasis}</span>
                    </h3>
                    <p className="lp-words m3-lede mt-5 max-w-[440px] text-[14px]">{row.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* ---------------- Partner With MAKERS3D (closing) ---------------------- */}
        <section id="apply" className="relative overflow-hidden border-t border-black/[0.08]">
          <div className="m3-blueprint absolute inset-0 opacity-70" aria-hidden="true" />
          <div className="m3-rails" aria-hidden="true" />
          <Field name="lattice" className="inset-x-[-5%] top-[-15%] h-[130%] w-[110%]" opacity={0.3} />

          <div className="m3-shell relative z-[1] py-16 sm:py-24 lg:py-32">
            <Reveal>
              <div className="mx-auto max-w-[720px] text-center">
                <h2 className="lp-lines m3-display text-[clamp(2rem,5vw,3.75rem)] text-black">
                  Let&rsquo;s build it
                  <br />
                  <span className="text-black/35">layer by layer, together.</span>
                </h2>
                <p className="lp-words m3-lede mx-auto mt-7 max-w-[520px] text-[15px]">
                  No canned proposals. We start by understanding your clients, your volume
                  and the deadlines you work to — then structure the arrangement around it.
                </p>
              </div>
            </Reveal>

            <div className="mt-10 grid gap-12 sm:mt-16 sm:gap-14 lg:grid-cols-[1.3fr_0.7fr] lg:gap-20">
              <Reveal delay={80} className="lp-panel">
                <PartnerForm />
              </Reveal>

              <Reveal delay={140}>
                <div>
                  <Eyebrow>Prefer to start with one job?</Eyebrow>
                  <h3 className="lp-lines m3-display mt-6 text-[clamp(1.5rem,3vw,2.25rem)] text-black">
                    Send a live project
                    <br />
                    and see the work.
                  </h3>
                  <p className="lp-words m3-lede mt-6 text-[14px]">
                    Most partnerships start with a single build. Send a real requirement,
                    see how we handle it, then decide whether to make it ongoing.
                  </p>

                  <div className="lp-fade mt-9">
                    <Cta href="/contact" tone="solid">
                      Get a Free Quote
                    </Cta>
                  </div>

                  <div className="mt-12">
                    <Eyebrow>Connect with us</Eyebrow>
                    <div className="mt-6 space-y-3.5">
                      <a
                        href="mailto:studio@makers3d.in"
                        className="block text-[14px] font-light text-black/60 underline-offset-8 transition-colors duration-500 hover:text-black hover:underline"
                      >
                        studio@makers3d.in
                      </a>
                      <a
                        href="https://www.instagram.com/makers3d.in"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-[14px] font-light text-black/60 underline-offset-8 transition-colors duration-500 hover:text-black hover:underline"
                      >
                        Instagram
                      </a>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <EnterpriseFooter />
      </PageMotion>
    </main>
  );
}

/**
 * Line-art glyphs echoing the Figma card illustrations (burst, gem, node),
 * drawn as SVG so they stay crisp and cost nothing.
 */
function CardGlyph({ index, featured }: { index: number; featured: boolean }) {
  const stroke = featured ? 'rgba(255,255,255,0.30)' : 'rgba(0,0,0,0.30)';

  return (
    <svg
      width="76"
      height="76"
      viewBox="0 0 76 76"
      fill="none"
      aria-hidden="true"
      className="mb-8 transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-45"
    >
      {index === 0 &&
        Array.from({ length: 16 }).map((_, i) => {
          const a = (i / 16) * Math.PI * 2;
          return (
            <line
              key={i}
              x1={38 + Math.cos(a) * 10}
              y1={38 + Math.sin(a) * 10}
              x2={38 + Math.cos(a) * 34}
              y2={38 + Math.sin(a) * 34}
              stroke={stroke}
              strokeWidth="1"
            />
          );
        })}

      {index === 1 && (
        <>
          <path d="M38 8 L68 30 L38 68 L8 30 Z" stroke={stroke} strokeWidth="1" />
          <path d="M8 30 H68 M38 8 V68 M22 19 L30 68 M54 19 L46 68" stroke={stroke} strokeWidth="1" />
        </>
      )}

      {index === 2 && (
        <>
          <circle cx="38" cy="38" r="30" stroke={stroke} strokeWidth="1" strokeDasharray="3 4" />
          <rect x="22" y="22" width="32" height="32" stroke={stroke} strokeWidth="1" />
          <circle cx="38" cy="38" r="8" stroke={stroke} strokeWidth="1" />
        </>
      )}
    </svg>
  );
}
