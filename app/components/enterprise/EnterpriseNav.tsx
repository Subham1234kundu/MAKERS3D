'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { NAV } from './content';
import { useSession } from 'next-auth/react';
import { useCart } from '../../providers/CartProvider';

export default function EnterpriseNav() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  // A section counts as current on its own page and on any page beneath it.
  const isCurrent = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock page scroll while the mobile sheet is open, so swipes scroll the
  // sheet rather than the page behind it. Both <html> and <body> are locked
  // (mobile browsers differ on which one scrolls); prior values are restored
  // so the landing loader's own lock is never clobbered.
  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const prev = [html.style.overflow, document.body.style.overflow];
    html.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      [html.style.overflow, document.body.style.overflow] = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <>
      <header
        className={[
          'fixed inset-x-0 top-0 z-[9000] border-b transition-[background-color,border-color,backdrop-filter] duration-700',
          solid
            ? 'border-black/[0.08] bg-white/90 backdrop-blur-xl'
            : 'border-black/[0.06] bg-white',
        ].join(' ')}
      >
        <div className="m3-shell flex h-[72px] items-center justify-between">
          <Link href="/" className="flex items-center gap-3" aria-label="MAKERS3D home">
            <Image
              src="/images/logo.png"
              alt="MAKERS3D logo"
              width={778}
              height={628}
              priority
              className="h-7 w-auto"
            />
            <span className="hidden text-[13px] font-medium uppercase tracking-[0.3em] text-black min-[400px]:inline">
              Makers3D
            </span>
          </Link>

          <nav className="hidden items-center gap-9 lg:flex">
            {NAV.map((item) => {
              const current = isCurrent(item.href);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  aria-current={current ? 'page' : undefined}
                  className={`group relative text-[12px] tracking-[0.06em] transition-colors duration-500 hover:text-black ${
                    current ? 'font-normal text-black' : 'font-light text-black/55'
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute -bottom-1.5 left-0 h-px bg-black transition-[width] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-full ${
                      current ? 'w-full' : 'w-0'
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <AccountLink />
            <CartLink />

            <Link
              href="/collections"
              aria-current={isCurrent('/collections') ? 'page' : undefined}
              className="m3-sheen m3-morph hidden border border-black/20 px-6 py-3 text-[10px] font-medium uppercase tracking-[0.22em] text-black hover:border-black/60 hover:bg-black/[0.03] sm:inline-flex"
            >
              Our Collection
            </Link>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              className="grid h-10 w-10 place-items-center border border-black/15 text-black lg:hidden"
            >
              <span className="relative block h-3 w-4">
                <span
                  className={`absolute left-0 block h-px w-full bg-current transition-all duration-500 ${
                    open ? 'top-1.5 rotate-45' : 'top-0'
                  }`}
                />
                <span
                  className={`absolute left-0 top-1.5 block h-px w-full bg-current transition-opacity duration-300 ${
                    open ? 'opacity-0' : 'opacity-100'
                  }`}
                />
                <span
                  className={`absolute left-0 block h-px w-full bg-current transition-all duration-500 ${
                    open ? 'top-1.5 -rotate-45' : 'top-3'
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile sheet — starts below the nav bar and scrolls on its own, so
          the first item is never hidden behind the header on short screens. */}
      <div
        inert={!open}
        className={[
          'fixed inset-x-0 bottom-0 top-[72px] z-[8999] overflow-y-auto overscroll-contain bg-white/95 backdrop-blur-2xl transition-opacity duration-500 lg:hidden',
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
        ].join(' ')}
      >
        <div className="m3-shell flex min-h-full flex-col justify-center gap-1 pb-[calc(2rem+env(safe-area-inset-bottom))] pt-6">
          {NAV.map((item, i) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setOpen(false)}
              aria-current={isCurrent(item.href) ? 'page' : undefined}
              className={`border-b border-black/[0.08] py-5 text-2xl font-light tracking-tight transition-[opacity,transform] duration-700 ${
                isCurrent(item.href) ? 'text-black' : 'text-black/45'
              }`}
              style={{
                transitionDelay: `${open ? 90 + i * 60 : 0}ms`,
                opacity: open ? 1 : 0,
                transform: open ? 'none' : 'translateY(14px)',
              }}
            >
              <span className="m3-eyebrow mr-4">{String(i + 1).padStart(2, '0')}</span>
              {item.label}
            </Link>
          ))}

          <Link
            href="/collections"
            aria-current={isCurrent('/collections') ? 'page' : undefined}
            onClick={() => setOpen(false)}
            className="mt-10 inline-flex items-center justify-center border border-black bg-black px-8 py-4 text-[11px] font-medium uppercase tracking-[0.22em] text-white"
          >
            Our Collection
          </Link>
        </div>
      </div>
    </>
  );
}

/**
 * Account shortcut: signed-out visitors go to /login, signed-in users to
 * their profile (showing their avatar or initial).
 */
function AccountLink() {
  const { data: session, status } = useSession();
  const user = session?.user;
  const signedIn = status === 'authenticated';
  const initial = (user?.name || user?.email || '?').trim().charAt(0).toUpperCase();

  return (
    <Link
      href={signedIn ? '/profile' : '/login'}
      aria-label={signedIn ? 'Your profile' : 'Log in'}
      title={signedIn ? 'Your profile' : 'Log in'}
      className="relative grid h-10 w-10 place-items-center overflow-hidden border border-black/15 text-black transition-colors duration-500 hover:border-black/60"
    >
      {signedIn && user?.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={user.image}
          alt=""
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover"
        />
      ) : signedIn ? (
        <span className="text-[12px] font-medium">{initial}</span>
      ) : (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.3" />
          <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      )}
    </Link>
  );
}

/**
 * Cart shortcut, always visible. The badge appears once something is in
 * the cart and pops each time the count changes.
 */
function CartLink() {
  const { cartCount } = useCart();
  const [pop, setPop] = useState(false);

  useEffect(() => {
    if (cartCount === 0) return;
    setPop(true);
    const t = setTimeout(() => setPop(false), 350);
    return () => clearTimeout(t);
  }, [cartCount]);

  return (
    <Link
      href="/cart"
      aria-label={`Cart, ${cartCount} item${cartCount === 1 ? '' : 's'}`}
      title="Cart"
      className="relative grid h-10 w-10 place-items-center border border-black/15 text-black transition-colors duration-500 hover:border-black/60"
    >
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M6 7h12l-1 13H7L6 7Z M9 7V5.5a3 3 0 0 1 6 0V7"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
      </svg>
      {cartCount > 0 && (
        <span
          className={[
            'absolute -right-1.5 -top-1.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-black px-1 font-mono text-[9px] tabular-nums text-white transition-transform duration-300',
            pop ? 'scale-125' : 'scale-100',
          ].join(' ')}
        >
          {cartCount}
        </span>
      )}
    </Link>
  );
}
