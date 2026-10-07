'use client';

import Link from 'next/link';
import Image from 'next/image';

const COLUMNS = [
  {
    heading: 'What We Serve',
    links: [
      { label: 'Scale Miniatures', href: '/services#miniatures' },
      { label: 'Functional Models', href: '/services#models' },
      { label: 'Design & Prototyping', href: '/services#design' },
      { label: 'Reverse Engineering', href: '/services#reverse' },
      { label: 'Bulk Production', href: '/services#bulk' },
    ],
  },
  {
    heading: 'Industries',
    links: [
      { label: 'Heavy Machinery', href: '/industries#manufacturing' },
      { label: 'Automotive', href: '/industries#automotive' },
      { label: 'Architecture', href: '/industries#architecture' },
      { label: 'Jewellery', href: '/industries#jewellery' },
      { label: 'Product Design', href: '/industries#product' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Partners', href: '/partner' },
      { label: 'Collection', href: '/collections' },
      { label: 'Get a Free Quote', href: '/contact' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Shipping Policy', href: '/shipping-policy' },
      { label: 'Return Policy', href: '/return-policy' },
    ],
  },
];

export default function EnterpriseFooter() {
  return (
    <footer className="relative border-t border-black/[0.08] bg-white">
      <div className="m3-rails" aria-hidden="true" />

      <div className="m3-shell relative z-[1]">
        <div className="grid gap-12 border-b border-black/[0.08] py-16 lg:grid-cols-[1.4fr_2.6fr]">
          <div>
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/images/logo.png"
                alt="MAKERS3D logo"
                width={778}
                height={628}
                className="h-7 w-auto"
              />
              <span data-cursor-size="large" className="text-[16px] font-medium uppercase tracking-[0.3em] text-black">
                Makers3D
              </span>
            </Link>

            <p className="m3-lede mt-6 max-w-[320px] text-[13px]">
              Additive manufacturing, CAD design and reverse engineering for companies that
              ship physical products.
            </p>

            <a
              href="mailto:studio@makers3d.in"
              className="mt-7 inline-block text-[13px] font-light text-black/50 underline-offset-8 transition-colors duration-500 hover:text-black hover:underline"
            >
              studio@makers3d.in
            </a>
          </div>

          <div className="lp-stagger grid grid-cols-2 gap-10 md:grid-cols-4">
            {COLUMNS.map((col) => (
              <div key={col.heading}>
                <h3 className="m3-eyebrow">{col.heading}</h3>
                <ul className="mt-6 space-y-3.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        className="text-[13px] font-light text-black/40 transition-colors duration-500 hover:text-black"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 py-8 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-[11px] font-light tracking-[0.06em] text-black/25">
            © {new Date().getFullYear()} MAKERS3D. All rights reserved.
          </span>
          <span className="m3-eyebrow !text-[9px]">Designed &amp; manufactured in India</span>
        </div>
      </div>

      {/* Full-width wordmark with a compact finish at the bottom of the page. */}
      <div className="relative z-[1] select-none overflow-hidden pb-2" aria-hidden="true">
        <div className="w-full text-center [container-type:inline-size]">
          <span data-cursor-size="large" className="block text-[19.5cqw] font-extralight leading-[0.8] tracking-[-0.065em] text-black">
            MAKERS3D
          </span>
        </div>
      </div>
    </footer>
  );
}
