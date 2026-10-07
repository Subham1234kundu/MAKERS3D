import type { Metadata } from 'next';
import EnterpriseNav from './components/enterprise/EnterpriseNav';
import Hero from './components/enterprise/Hero';
import ClientRail from './components/enterprise/ClientRail';
import Statement from './components/enterprise/Statement';
import WhatWeDo from './components/enterprise/WhatWeDo';
import WhyUs from './components/enterprise/WhyUs';
import Work from './components/enterprise/Work';
import Collection from './components/enterprise/Collection';
import LandingFaq from './components/enterprise/LandingFaq';
import ClosingCta from './components/enterprise/ClosingCta';
import EnterpriseFooter from './components/enterprise/EnterpriseFooter';
import Loader from './components/enterprise/Loader';
import LandingMotion from './components/enterprise/LandingMotion';
import { BRAND_ALIASES, HOME_DESCRIPTION, HOME_TITLE, SITE_URL, SOCIAL_IMAGE, pageMetadata } from './lib/seo';

const TITLE = HOME_TITLE;
const DESCRIPTION = HOME_DESCRIPTION;

export const metadata: Metadata = pageMetadata({ title: TITLE, description: DESCRIPTION, path: '/' });

const SERVICES = [
  { id: 'scale-models', name: 'Custom scale model manufacturing', url: '/services#miniatures', description: 'Custom machinery miniatures and presentation models, with scale and finishing options discussed for each project.' },
  { id: 'prototyping', name: 'CAD design and 3D product prototyping', url: '/services#design', description: 'CAD design and printed prototypes to explore product form, fit and function.' },
  { id: 'batch-printing', name: 'Batch 3D printing', url: '/services#bulk', description: '3D printed parts and custom objects for individual prototypes and production batches.' },
];

// Describe visible services and site identity; structured data does not guarantee rich results.
const STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: 'MAKERS3D',
      alternateName: BRAND_ALIASES,
      publisher: { '@id': `${SITE_URL}/#organization` },
      inLanguage: 'en-IN',
    },
    {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/#webpage`,
      url: SITE_URL,
      name: TITLE,
      description: DESCRIPTION,
      isPartOf: { '@id': `${SITE_URL}/#website` },
      about: { '@id': `${SITE_URL}/#organization` },
      primaryImageOfPage: { '@type': 'ImageObject', url: `${SITE_URL}${SOCIAL_IMAGE}`, width: 1200, height: 630 },
      mainEntity: { '@id': `${SITE_URL}/#services` },
      inLanguage: 'en-IN',
    },
    {
      '@type': 'ItemList',
      '@id': `${SITE_URL}/#services`,
      name: 'MAKERS3D services',
      itemListElement: SERVICES.map((service, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: { '@id': `${SITE_URL}/#${service.id}` },
      })),
    },
    ...SERVICES.map((service) => ({
      '@type': 'Service',
      '@id': `${SITE_URL}/#${service.id}`,
      name: service.name,
      description: service.description,
      url: `${SITE_URL}${service.url}`,
      provider: { '@id': `${SITE_URL}/#organization` },
      areaServed: { '@type': 'Country', name: 'India' },
    })),
  ],
};

export default function HomePage() {
  return (
    <div className="m3-page m3-landing min-h-screen bg-white text-black antialiased">
      <a href="#main-content" className="landing-skip">Skip to content</a>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA).replace(/</g, '\\u003c') }} />
      <Loader />
      <LandingMotion>
        <EnterpriseNav />
        <main id="main-content">
          <Hero />
          <ClientRail />
          <Statement />
          <WhatWeDo />
          <Collection />
          <Work />
          <WhyUs />
          <LandingFaq />
          <ClosingCta />
        </main>
        <EnterpriseFooter />
      </LandingMotion>
    </div>
  );
}
