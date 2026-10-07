import Link from 'next/link';
import Image from 'next/image';
import { Section, Eyebrow, Reveal, Cta } from './primitives';
import { getShowcaseProducts } from './getProducts';

/** Fallback imagery for when the collection is empty or the database is down. */
const PLACEHOLDERS = [
  '/images/product-2.jpg',
  '/images/product-4.jpg',
  '/images/product-6.jpg',
  '/images/product-8.jpg',
];

/**
 * The retail side of the business, populated from the live products
 * collection. Server component: the pieces render into the HTML so they are
 * indexable, and new uploads appear without a redeploy.
 */
export default async function Collection() {
  const products = await getShowcaseProducts(4);
  const hasProducts = products.length > 0;

  return (
    <Section className="py-16 sm:py-24 lg:py-36">
      <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <Eyebrow>Makers3D Collection</Eyebrow>

          <h2 className="lp-lines m3-display mt-7 text-[clamp(2rem,4.2vw,3.25rem)] text-black">
            Our own ideas,
            <br />
            <span className="text-black/35">printed layer by layer.</span>
          </h2>

          <p className="lp-words m3-lede mt-7 max-w-[480px] text-[15px]">
            Between client work we design pieces of our own — decor and desk objects,
            printed and finished on the same industrial machines. Limited runs, sold
            directly.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Cta href="/collections">Shop the Collection</Cta>
          </div>
        </Reveal>

        <Reveal delay={110}>
          <div className="lp-tiles grid grid-cols-2 gap-px">
            {hasProducts
              ? products.map((p) => (
                  <Link
                    key={p.id}
                    href={`/products/${p.id}`}
                    className="group relative aspect-square overflow-hidden"
                  >
                    <Image
                      src={p.image as string}
                      alt={p.name}
                      fill
                      sizes="(max-width: 1024px) 50vw, 25vw"
                      className="scale-[1.02] object-cover opacity-90 transition-[opacity,transform] duration-[1600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-100 group-hover:opacity-100"
                    />

                    <div
                      aria-hidden="true"
                      className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                      style={{
                        background:
                          'linear-gradient(180deg, transparent 45%, rgba(255,255,255,0.88) 100%)',
                      }}
                    />

                    <div className="absolute inset-x-0 bottom-0 translate-y-2 p-5 opacity-0 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-hover:opacity-100">
                      <h3 className="line-clamp-2 text-[12px] font-light leading-snug tracking-tight text-black">
                        {p.name}
                      </h3>
                      {p.price > 0 && (
                        <span className="mt-1.5 block font-mono text-[10px] tracking-[0.12em] text-black/50">
                          ₹{p.price.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </Link>
                ))
              : PLACEHOLDERS.map((src, i) => (
                  <div
                    key={src}
                    className="group relative aspect-square overflow-hidden"
                  >
                    <Image
                      src={src}
                      alt={`Makers3D collection piece ${i + 1}`}
                      fill
                      sizes="(max-width: 1024px) 50vw, 25vw"
                      className="scale-[1.02] object-cover opacity-90 transition-[opacity,transform] duration-[1600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-100 group-hover:opacity-100"
                    />
                  </div>
                ))}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
