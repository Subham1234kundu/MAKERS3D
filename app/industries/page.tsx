import type { Metadata } from 'next';
import Image from 'next/image';

import EnterpriseNav from '../components/enterprise/EnterpriseNav';
import EnterpriseFooter from '../components/enterprise/EnterpriseFooter';
import PageHeader from '../components/enterprise/PageHeader';
import Contact from '../components/enterprise/Contact';
import PageMotion from '../components/enterprise/PageMotion';
import { Section, Reveal, Cta } from '../components/enterprise/primitives';
import { SECTORS } from '../components/enterprise/content';

const TITLE =
  'Industries We Serve | Scale Models & 3D Printing';

const DESCRIPTION =
  'MAKERS3D builds scale models and 3D printed parts for heavy machinery, automotive, architecture, jewellery and product design teams across India.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'heavy machinery scale models',
    'automotive prototyping India',
    'architectural scale models',
    'jewellery 3D printing',
    'product design prototyping',
    'industrial 3D printing India',
  ],
  alternates: { canonical: 'https://makers3d.in/industries' },
  openGraph: {
    type: 'website',
    url: 'https://makers3d.in/industries',
    siteName: 'MAKERS3D',
    title: TITLE,
    description: DESCRIPTION,
    locale: 'en_IN',
  },
};

const STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Industries served by MAKERS3D',
  itemListElement: SECTORS.map((s, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: {
      '@type': 'Service',
      name: `Scale models and 3D printing for ${s.name}`,
      description: s.thesis,
      provider: { '@type': 'Organization', name: 'MAKERS3D' },
      areaServed: 'IN',
    },
  })),
};

export default function IndustriesPage() {
  return (
    <main className="m3-page min-h-screen bg-white text-black antialiased">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA) }}
      />
      <PageMotion>
        <EnterpriseNav />

        <PageHeader
          title={
            <>
              Built for the
              <br />
              <span className="text-black/35">industries that build.</span>
            </>
          }
          lede="Different industries, one requirement: a physical object accurate enough to be trusted. Here is what we make for each of them."
          field={null}
          image={{
            src: '/images/industries/prototypes-hero.webp',
            alt: '3D printed product enclosures, impeller, engineering chassis and mounting bracket prototypes',
          }}
        />

        <Section className="py-6 sm:py-10">
          <nav className="lp-chips -mx-[var(--m3-gutter)] flex gap-2 overflow-x-auto px-[var(--m3-gutter)] [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:gap-x-6 sm:gap-y-3 sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden" aria-label="Industries">
            {SECTORS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="m3-morph shrink-0 border border-black/15 px-4 py-2.5 text-[12px] font-light text-black/55 underline-offset-8 hover:text-black sm:border-0 sm:p-0 sm:text-black/35 sm:hover:underline"
              >
                {s.name}
              </a>
            ))}
          </nav>
        </Section>

        {SECTORS.map((s, i) => (
          <Section key={s.id} id={s.id} className="py-14 sm:py-20 lg:py-28">
            <Reveal>
              <div
                className={`grid items-center gap-8 md:grid-cols-2 md:gap-10 lg:gap-20 ${
                  i % 2 === 1 ? 'md:[&>*:first-child]:order-2' : ''
                }`}
              >
                <div>
                  <span className="lp-fade m3-eyebrow inline-block">{String(i + 1).padStart(2, '0')}</span>

                  <h2 className="lp-lines m3-display mt-6 text-[clamp(1.75rem,3.6vw,2.75rem)] text-black">
                    {s.name}
                  </h2>

                  <p className="lp-words m3-lede mt-6 max-w-[500px] text-[15px]">{s.thesis}</p>

                  {s.body && (
                    <p className="lp-fade m3-lede mt-5 max-w-[500px] text-[13px] text-black/35">
                      {s.body}
                    </p>
                  )}

                  <div className="mt-9">
                    <span className="lp-fade m3-eyebrow inline-block">What we build</span>
                    <ul className="lp-stagger mt-5 grid gap-px border-t border-black/[0.08] sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
                      {(s.outcomes ?? s.applications).map((a) => (
                        <li
                          key={a}
                          className="border-b border-black/[0.08] py-3.5 text-[13px] font-light text-black/55"
                        >
                          {a}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="lp-fade mt-9">
                    <Cta href="/contact" className="w-full justify-between sm:w-auto sm:justify-start">
                      Get a Free Quote
                    </Cta>
                  </div>
                </div>

                <div className="lp-media group relative order-first aspect-[4/3] w-full overflow-hidden md:order-none border border-black/[0.08] bg-white">
                  <div className="lp-card-art absolute inset-0">
                    <Image
                      src={s.detailImage?.src ?? s.image}
                      alt={s.detailImage?.alt ?? `Scale models and 3D printed parts for the ${s.name.toLowerCase()} sector`}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="scale-[1.02] object-contain p-4 transition-transform duration-[1600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-100"
                    />
                  </div>
                </div>
              </div>
            </Reveal>
          </Section>
        ))}

        <Contact />
        <EnterpriseFooter />
      </PageMotion>
    </main>
  );
}
