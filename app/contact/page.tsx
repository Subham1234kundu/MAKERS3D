import type { Metadata } from 'next';

import EnterpriseNav from '../components/enterprise/EnterpriseNav';
import EnterpriseFooter from '../components/enterprise/EnterpriseFooter';
import PageHeader from '../components/enterprise/PageHeader';
import QuoteForm from '../components/enterprise/QuoteForm';
import PageMotion from '../components/enterprise/PageMotion';
import { Section, Reveal, Eyebrow } from '../components/enterprise/primitives';

const TITLE = 'Get a Free Quote | Contact Us';

const DESCRIPTION =
  'Send us a photo of your machine or product and get a free quote. Scale models, industrial 3D printing, CAD design, reverse engineering and bulk production across India.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: 'https://makers3d.in/contact' },
  openGraph: {
    type: 'website',
    url: 'https://makers3d.in/contact',
    siteName: 'MAKERS3D',
    title: TITLE,
    description: DESCRIPTION,
    locale: 'en_IN',
  },
};

const STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: TITLE,
  description: DESCRIPTION,
  mainEntity: {
    '@type': 'Organization',
    name: 'MAKERS3D',
    url: 'https://makers3d.in',
    email: 'studio@makers3d.in',
    areaServed: 'IN',
  },
};

const STEPS = [
  { index: '01', title: 'Send a photo', body: 'A phone photo of the machine or product is enough to start.' },
  { index: '02', title: 'We reply with a plan', body: 'Scale, material, finish and cost — in plain language, within a working day.' },
  { index: '03', title: 'You decide', body: 'No obligation. Approve it and we start building, or walk away.' },
];

export default function ContactPage() {
  return (
    <main className="m3-page min-h-screen bg-white text-black antialiased">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA) }}
      />
      <PageMotion>
        <EnterpriseNav />

        <PageHeader
          eyebrow="Get a free quote"
          title={
            <>
              Send us a photo.
              <br />
              <span className="text-black/35">We will send back a plan.</span>
            </>
          }
          lede="One photo is enough to start. Tell us what you need and we will come back with how we would build it, at what scale, in what material and what it costs."
          field="lattice"
        />

        <Section className="py-12 sm:py-20 lg:py-28">
          <div className="grid gap-12 sm:gap-14 lg:grid-cols-[1.35fr_0.65fr] lg:gap-20">
            <Reveal>
              <QuoteForm />
            </Reveal>

            <Reveal delay={110}>
              <div>
                <Eyebrow>How it works</Eyebrow>

                <div className="lp-stagger mt-8 grid border-t border-black/[0.08] md:grid-cols-3 md:gap-x-8 lg:grid-cols-1 lg:gap-x-0">
                  {STEPS.map((s) => (
                    <div key={s.index} className="border-b border-black/[0.08] py-6">
                      <span className="m3-eyebrow">{s.index}</span>
                      <h3 className="mt-3.5 text-[16px] font-light tracking-tight text-black">
                        {s.title}
                      </h3>
                      <p className="m3-lede mt-2 text-[13px]">{s.body}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-12">
                  <Eyebrow>Or reach us directly</Eyebrow>
                  <div className="mt-7 space-y-4">
                    <a
                      href="mailto:studio@makers3d.in"
                      className="block text-[14px] font-light text-black/60 underline-offset-8 transition-colors duration-500 hover:text-black hover:underline"
                    >
                      studio@makers3d.in
                    </a>
                    <a
                      href="https://wa.me/917863983914"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-[14px] font-light text-black/60 underline-offset-8 transition-colors duration-500 hover:text-black hover:underline"
                    >
                      WhatsApp · +91 78639 83914
                    </a>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </Section>

        <EnterpriseFooter />
      </PageMotion>
    </main>
  );
}
