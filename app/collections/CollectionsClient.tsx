'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import EnterpriseNav from '../components/enterprise/EnterpriseNav';
import EnterpriseFooter from '../components/enterprise/EnterpriseFooter';
import PageMotion from '../components/enterprise/PageMotion';
import Contact from '../components/enterprise/Contact';
import { Section } from '../components/enterprise/primitives';
import { useCart } from '../providers/CartProvider';
import { gsap, useGSAP } from '@/lib/gsap';

type ImageRef = string | { url?: string; alt?: string };

interface Product {
  id: string;
  name?: string;
  title?: string;
  price: number;
  originalPrice?: number;
  subCategory?: string;
  image?: string;
  images?: ImageRef[];
}

interface Category {
  id: string;
  label: string;
}

const ALL: Category = { id: 'ALL', label: 'All pieces' };

const imageAt = (p: Product, i: number) => {
  const img = p.images?.[i];
  if (!img) return i === 0 ? p.image : undefined;
  return typeof img === 'string' ? img : img.url;
};

const altAt = (p: Product, i: number) => {
  const img = p.images?.[i];
  return (typeof img === 'object' && img?.alt) || p.name || p.title || 'MAKERS3D piece';
};

/**
 * The retail collection, in the enterprise theme: the product catalogue
 * from /products, filtered by the sub-collections defined in the admin.
 */
export default function CollectionsClient({ initialProducts }: { initialProducts: Product[] }) {
  const [categories, setCategories] = useState<Category[]>([ALL]);
  const [active, setActive] = useState(ALL.id);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isLoading, setIsLoading] = useState(false);
  const grid = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/collections');
        if (!res.ok) return;
        const data = await res.json();
        const subs = new Map<string, Category>();
        for (const c of data ?? []) {
          for (const sub of c.subCollections ?? []) {
            const id = String(sub.slug).toUpperCase();
            if (!subs.has(id)) subs.set(id, { id, label: sub.name });
          }
        }
        setCategories([ALL, ...subs.values()]);
      } catch (error) {
        console.error('Error fetching collections:', error);
      }
    })();

    (async () => {
      try {
        const res = await fetch(`/api/products?t=${Date.now()}`, { cache: 'no-store' });
        if (res.ok) setProducts(await res.json());
      } catch (error) {
        console.error('Fetch products error:', error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(
    () =>
      active === ALL.id
        ? products
        : products.filter((p) => p.subCategory?.toUpperCase() === active),
    [products, active],
  );

  // Pieces deal in one after another whenever the grid is (re)filled.
  useGSAP(
    () => {
      if (isLoading || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      gsap.fromTo(
        '.shop-card',
        { y: 40, opacity: 0, clipPath: 'inset(0% 0% 100% 0%)' },
        {
          y: 0,
          opacity: 1,
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 0.9,
          ease: 'expo.out',
          stagger: 0.07,
          clearProps: 'clipPath',
        },
      );
    },
    { scope: grid, dependencies: [isLoading, active] },
  );

  return (
    <main className="m3-page min-h-screen bg-white text-black antialiased">
      <PageMotion>
        <EnterpriseNav />

        <header className="lp-masthead lp-intro pt-[72px]">
          <div className="m3-shell pb-6 pt-8 sm:pb-8 sm:pt-12 lg:pb-10 lg:pt-16">
            <h1 className="lp-masthead-title m3-display text-[clamp(1.75rem,3.6vw,2.75rem)] text-black">
              Our Collection
            </h1>
          </div>
        </header>

        {/* Filter bar — sticks under the nav while the grid scrolls. */}
        <div className="sticky top-[72px] z-[40] border-y border-black/[0.08] bg-white/90 backdrop-blur-xl">
          <div className="m3-shell flex items-center gap-2 overflow-x-auto py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {categories.map((cat) => {
              const on = cat.id === active;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActive(cat.id)}
                  aria-pressed={on}
                  className={`shrink-0 border px-5 py-2.5 text-[10px] font-medium uppercase tracking-[0.22em] transition-colors duration-500 ${
                    on
                      ? 'border-black bg-black text-white'
                      : 'border-black/15 text-black/45 hover:border-black/50 hover:text-black'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
            <span className="ml-auto shrink-0 pl-6 font-mono text-[10px] tabular-nums tracking-[0.18em] text-black/30">
              {isLoading ? '—' : String(filtered.length).padStart(2, '0')} pieces
            </span>
          </div>
        </div>

        <Section bordered={false} className="py-8 sm:py-14 lg:py-20">
          <div ref={grid}>
            {isLoading ? (
              <div className="grid grid-cols-2 gap-px md:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="aspect-[3/4] animate-pulse bg-black/[0.04]" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <p className="py-32 text-center text-[11px] font-light uppercase tracking-[0.3em] text-black/30">
                No pieces in this series yet
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-x-px gap-y-8 sm:gap-y-10 md:grid-cols-3 lg:grid-cols-4">
                {filtered.map((p) => (
                  <ShopCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </Section>

        <Contact />
        <EnterpriseFooter />
      </PageMotion>
    </main>
  );
}

function ShopCard({ product }: { product: Product }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const title = product.name || product.title || 'Untitled piece';
  const first = imageAt(product, 0);
  const second = imageAt(product, 1);
  const href = `/products/${product.id}`;
  const discounted = product.originalPrice && product.originalPrice > product.price;

  const add = () => {
    addToCart({
      id: product.id,
      image: first ?? '',
      title,
      price: product.price,
      originalPrice: product.originalPrice ?? product.price,
      category: product.subCategory ?? 'ALL',
    });
    router.push('/cart');
  };

  return (
    <div className="shop-card group">
      <div className="relative aspect-[3/4] overflow-hidden bg-black/[0.03]">
        <Link href={href} className="absolute inset-0" aria-label={title}>
          {first ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={first}
                alt={altAt(product, 0)}
                referrerPolicy="no-referrer"
                className={`absolute inset-0 h-full w-full scale-[1.02] object-cover transition-[opacity,transform] duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-100 ${
                  second ? 'group-hover:opacity-0' : ''
                }`}
              />
              {second && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={second}
                  alt={altAt(product, 1)}
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                />
              )}
            </>
          ) : (
            <span className="absolute inset-0 grid place-items-center text-[10px] uppercase tracking-[0.2em] text-black/25">
              No image
            </span>
          )}
          <span className="pointer-events-none absolute inset-0 border border-black/[0.06] transition-colors duration-500 group-hover:border-black/25" />
        </Link>

        <button
          type="button"
          onClick={add}
          aria-label={`Add ${title} to cart`}
          className="absolute bottom-3 right-3 grid h-10 w-10 place-items-center bg-black text-white transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-110 active:scale-95 lg:translate-y-2 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <Link href={href} className="mt-4 block px-1">
        <h3 className="line-clamp-2 text-[14px] font-light leading-snug tracking-tight text-black">
          {title}
        </h3>
        <div className="mt-2 flex items-baseline gap-3 font-mono text-[11px] tracking-[0.08em]">
          <span className="text-black">₹{product.price.toLocaleString('en-IN')}</span>
          {discounted && (
            <span className="text-black/30 line-through">
              ₹{product.originalPrice!.toLocaleString('en-IN')}
            </span>
          )}
        </div>
      </Link>
    </div>
  );
}
