'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useCart } from '../providers/CartProvider';

// Dynamically import the 3D component to avoid SSR issues
const ParticleCubeLogo = dynamic(() => import('./ParticleCubeLogo'), {
  ssr: false,
  loading: () => <div style={{ width: '60px', height: '60px' }} />
});

interface NavIconsProps {
  isMobileNav?: boolean;
  session: any;
  router: any;
  cartCount: number;
  isSearchExpanded: boolean;
  setIsSearchExpanded: (val: boolean) => void;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  pathname: string;
}

// Sub-component moved OUTSIDE to prevent remounting loops
const NavIcons = ({
  isMobileNav = false,
  session,
  router,
  cartCount,
  isSearchExpanded,
  setIsSearchExpanded,
  searchInputRef,
  pathname
}: NavIconsProps) => {
  const isHomeActive = pathname === '/';
  const isProfileActive = pathname === '/profile' || pathname === '/login';
  const isLikesActive = pathname === '/likes';
  const isCartActive = pathname === '/cart';

  return (
    <div className={`nav-icons flex items-center ${isMobileNav ? 'justify-between w-full px-1' : 'gap-4 sm:gap-6'}`} suppressHydrationWarning>
      {/* Home Icon - Mobile Only */}
      {isMobileNav && (
        <Link href="/" className={`nav-icon ${isHomeActive ? 'active' : ''}`} aria-label="Home" suppressHydrationWarning>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-[18px] h-[18px]">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </Link>
      )}

      <div className={`search-container flex items-center relative h-10 px-3 transition-all duration-500 cursor-pointer ${isMobileNav ? '' : 'bg-white/5 border border-white/10 rounded-full'}`} suppressHydrationWarning
        onClick={(e) => {
          e.stopPropagation();
          if (!isSearchExpanded) setIsSearchExpanded(true);
          searchInputRef.current?.focus();
        }}
      >
        <button
          className={`nav-icon z-10`}
          aria-label="Search"
          onClick={(e) => {
            e.stopPropagation();
            setIsSearchExpanded(!isSearchExpanded);
          }}
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-[18px] h-[18px]">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
        <input
          ref={searchInputRef}
          type="text"
          placeholder="SEARCH..."
          className={`bg-transparent border-none outline-none text-[10px] uppercase tracking-[0.2em] font-light w-0 opacity-0 overflow-hidden transition-all duration-500 ease-in-out`}
          style={{ paddingLeft: isSearchExpanded ? '12px' : '0' }}
        />
      </div>

      <div className="user-menu-container flex items-center" suppressHydrationWarning>
        <button
          className={`nav-icon user-button ${isMobileNav && isProfileActive ? 'active' : ''}`}
          aria-label="User Account"
          onClick={() => {
            if (session) router.push('/profile');
            else router.push('/login');
          }}
          suppressHydrationWarning
        >
          {session?.user?.image ? (
            <img src={session.user.image} alt={session.user.name || 'User'} className={`user-avatar ${isMobileNav && isProfileActive ? 'border-white' : ''}`} />
          ) : (
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-[18px] h-[18px]">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          )}
        </button>
      </div>

      <Link href="/likes" className={`nav-icon ${!isMobileNav ? 'always-visible' : ''} ${isMobileNav && isLikesActive ? 'active' : ''}`} aria-label="Favorites" suppressHydrationWarning>
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-[18px] h-[18px]">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </Link>

      <Link href="/cart" className={`nav-icon ${!isMobileNav ? 'always-visible' : ''} ${isMobileNav && isCartActive ? 'active' : ''}`} aria-label="Cart" suppressHydrationWarning>
        <div className="cart-icon-wrapper" suppressHydrationWarning>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="cart-svg w-[18px] h-[18px]">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </div>
      </Link>
    </div>
  );
};

export default function Navbar() {
  const studioRef = useRef<HTMLSpanElement>(null);
  const logoTextRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { cartCount } = useCart();

  useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Top Navbar logic
      setIsScrolled(currentScrollY > 20);

      // Bottom Navbar logic (Hide on scroll down, show on scroll up)
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setShowMobileNav(false);
      } else {
        setShowMobileNav(true);
      }

      setLastScrollY(currentScrollY);
    };

    // Set initial mobile state
    handleResize();

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  // GSAP Animation for Search Column
  useEffect(() => {
    if (!searchInputRef.current) return;
    const targetWidth = isMobile ? (isSearchExpanded ? '100px' : '0') : (isSearchExpanded ? '150px' : '0');

    gsap.to(searchInputRef.current, {
      width: targetWidth,
      opacity: isSearchExpanded ? 1 : 0,
      duration: 0.4,
      ease: "power2.out"
    });

    if (!isMobile) {
      gsap.to('.search-container', {
        borderColor: isSearchExpanded ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)',
        duration: 0.3
      });
    }
  }, [isSearchExpanded, isMobile]);

  const handleLogoMouseEnter = () => {
    if (isMobile) return;
    if (logoTextRef.current) gsap.to(logoTextRef.current, { opacity: 1, x: 0, width: 'auto', duration: 0.5 });
    if (studioRef.current) gsap.to(studioRef.current, { opacity: 1, y: 0, height: 'auto', duration: 0.4, delay: 0.2 });
  };

  const handleLogoMouseLeave = () => {
    if (isMobile) return;
    if (studioRef.current) gsap.to(studioRef.current, { opacity: 0, y: -10, height: 0, duration: 0.3 });
    if (logoTextRef.current) gsap.to(logoTextRef.current, { opacity: 0, x: -20, width: 0, duration: 0.3 });
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-[9999] bg-black/40 backdrop-blur-xl border-b border-white/5 py-2 transition-all duration-500 ease-in-out ${isScrolled ? '-translate-y-full opacity-0 invisible pointer-events-none' : ''
          }`}
        suppressHydrationWarning
      >
        <div className="max-w-[1400px] mx-auto px-8 flex justify-between items-center" suppressHydrationWarning>
          <Link href="/" suppressHydrationWarning>
            <div
              className="flex items-center gap-6 lg:gap-6"
              onMouseEnter={handleLogoMouseEnter}
              onMouseLeave={handleLogoMouseLeave}
              suppressHydrationWarning
            >
              <div className="w-[70px] h-[70px] lg:w-[70px] lg:h-[70px] max-lg:w-[55px] max-lg:h-[55px]" suppressHydrationWarning>
                <ParticleCubeLogo />
              </div>
              <div ref={logoTextRef} className="flex flex-col whitespace-nowrap max-lg:mt-1" suppressHydrationWarning>
                <span className="text-[1.4rem] max-lg:text-[1rem] font-extrabold text-white leading-[0.9]">MAKERS</span>
                <span className="text-[1.4rem] max-lg:text-[1rem] font-extrabold text-white leading-[0.9]">3D</span>
                <span ref={studioRef} className="text-[0.7rem] max-lg:text-[0.6rem] font-bold tracking-[0.25em] max-lg:tracking-[0.2em] text-white mt-[0.15rem]">STUDIO</span>
              </div>
            </div>
          </Link>

          <div suppressHydrationWarning>
            {mounted && !isMobile && (
              <NavIcons
                session={session}
                router={router}
                cartCount={cartCount}
                isSearchExpanded={isSearchExpanded}
                setIsSearchExpanded={setIsSearchExpanded}
                searchInputRef={searchInputRef}
                pathname={pathname}
              />
            )}
          </div>
        </div>
      </nav>

      <div suppressHydrationWarning>
        {mounted && isMobile && (
          <div className={`mobile-nav fixed bottom-8 left-1/2 -translate-x-1/2 z-[10000] w-[92%] max-w-[400px] transition-all duration-500 ease-in-out ${showMobileNav ? 'translate-y-0 opacity-100' : 'translate-y-[150%] opacity-0 pointer-events-none'
            }`} suppressHydrationWarning>
            <div className="mobile-nav-container" suppressHydrationWarning>
              <NavIcons
                isMobileNav={true}
                session={session}
                router={router}
                cartCount={cartCount}
                isSearchExpanded={isSearchExpanded}
                setIsSearchExpanded={setIsSearchExpanded}
                searchInputRef={searchInputRef}
                pathname={pathname}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
