import type { Metadata } from 'next';
import Image from 'next/image';

import EnterpriseNav from '../components/enterprise/EnterpriseNav';
import EnterpriseFooter from '../components/enterprise/EnterpriseFooter';
import PageHeader from '../components/enterprise/PageHeader';
import Process from '../components/enterprise/Process';
import Contact from '../components/enterprise/Contact';
import PageMotion from '../components/enterprise/PageMotion';
import { Section, Reveal, Cta } from '../components/enterprise/primitives';
import { CAPABILITIES } from '../components/enterprise/content';
import { SITE_URL, breadcrumbs, jsonLd, pageMetadata } from '../lib/seo';

const TITLE = '3D Printing & Prototyping Services in India | MAKERS3D';

const DESCRIPTION =
  'Get custom 3D printing, scale models, CAD design, prototypes, 3D scanning and batch production in India. Share your project with MAKERS3D for a quote.';

export const metadata: Metadata = pageMetadata({ title: TITLE, description: DESCRIPTION, path: '/services' });

const STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'CollectionPage',
      '@id': `${SITE_URL}/services#webpage`,
      url: `${SITE_URL}/services`,
      name: TITLE,
      description: DESCRIPTION,
      isPartOf: { '@id': `${SITE_URL}/#website` },
      mainEntity: { '@id': `${SITE_URL}/services#services` },
      breadcrumb: { '@id': `${SITE_URL}/services#breadcrumb` },
    },
    { ...breadcrumbs([{ name: 'Home', path: '/' }, { name: 'Services', path: '/services' }]), '@id': `${SITE_URL}/services#breadcrumb` },
    {
      '@type': 'ItemList',
      '@id': `${SITE_URL}/services#services`,
      name: 'MAKERS3D 3D printing and model-making services',
      itemListElement: CAPABILITIES.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'Service',
          '@id': `${SITE_URL}/services#${c.slug}`,
          url: `${SITE_URL}/services#${c.slug}`,
          name: c.title,
          description: c.body,
          provider: { '@id': `${SITE_URL}/#organization` },
          areaServed: { '@type': 'Country', name: 'India' },
        },
      })),
    },
  ],
};

export default function ServicesPage() {
  return (
    <main className="m3-page min-h-screen bg-white text-black antialiased">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(STRUCTURED_DATA) }}
      />
      <PageMotion>
        <EnterpriseNav />

        <PageHeader
          title={
            <>
              Six ways we build.
              <br />
              <span className="text-black/35">One roof, every layer.</span>
            </>
          }
          lede="From a single showpiece model of your machine to ten thousand production units. Design, printing, finishing and checking all happen in our own studio."
          field={null}
          image={{
            src: '/images/services/hero.webp',
            alt: '3D printer, miniature crane, printed production parts and sculptural decor made in one studio',
          }}
        />

        {/* Index — lets a visitor jump straight to the service they came for. */}
        <Section className="py-6 sm:py-10">
          <nav className="lp-chips -mx-[var(--m3-gutter)] flex gap-2 overflow-x-auto px-[var(--m3-gutter)] [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:gap-x-6 sm:gap-y-3 sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden" aria-label="Services">
            {CAPABILITIES.map((c) => (
              <a
                key={c.slug}
                href={`#${c.slug}`}
                className="m3-morph shrink-0 border border-black/15 px-4 py-2.5 text-[12px] font-light text-black/55 underline-offset-8 hover:text-black sm:border-0 sm:p-0 sm:text-black/35 sm:hover:underline"
              >
                {c.title}
              </a>
            ))}
          </nav>
        </Section>

        {CAPABILITIES.map((c, i) => (
          <Section key={c.slug} id={c.slug} className="py-14 sm:py-20 lg:py-28">
            <Reveal>
              <div
                className={`grid items-center gap-8 md:grid-cols-2 md:gap-10 lg:gap-20 ${
                  i % 2 === 1 ? 'md:[&>*:first-child]:order-2' : ''
                }`}
              >
                <div>
                  <span className="lp-fade m3-eyebrow inline-block">{c.index}</span>

                  <h2 className="lp-lines m3-display mt-6 text-[clamp(1.75rem,3.6vw,2.75rem)] text-black">
                    {c.title}
                  </h2>

                  <p className="lp-words m3-lede mt-6 max-w-[500px] text-[15px]">{c.summary}</p>

                  {c.body && (
                    <p className="lp-fade m3-lede mt-5 max-w-[500px] text-[13px] text-black/35">
                      {c.body}
                    </p>
                  )}

                  {c.deliverables && (
                    <ul className="lp-stagger mt-9 grid gap-px border-t border-black/[0.08] sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
                      {c.deliverables.map((d) => (
                        <li
                          key={d}
                          className="border-b border-black/[0.08] py-3.5 text-[13px] font-light text-black/55"
                        >
                          {d}
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="lp-fade mt-9">
                    <Cta href="/contact" className="w-full justify-between sm:w-auto sm:justify-start">
                      Get a Free Quote
                    </Cta>
                  </div>
                </div>

                {(c.detailImage || c.image) && (
                  <div className="lp-media group relative order-first aspect-[4/3] w-full overflow-hidden md:order-none border border-black/[0.08] bg-white">
                    <div className="lp-card-art absolute inset-0">
                      <Image
                        src={c.detailImage?.src ?? c.image!}
                        alt={c.detailImage?.alt ?? `${c.title} — MAKERS3D`}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="scale-[1.02] object-contain p-4 transition-transform duration-[1600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-100"
                      />
                    </div>
                  </div>
                )}
              </div>
            </Reveal>
          </Section>
        ))}

        <Process />
        <Contact />
        <EnterpriseFooter />
      </PageMotion>
    </main>
  );
}
