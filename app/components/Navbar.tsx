'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCart } from '../providers/CartProvider';



// Dynamically import the 3D component to avoid SSR issues
const ParticleCubeLogo = dynamic(() => import('./ParticleCubeLogo'), {
  ssr: false,
  loading: () => <div style={{ width: '60px', height: '60px' }} />
});

export default function Navbar() {
  const studioRef = useRef<HTMLSpanElement>(null);
  const logoTextRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const { cartCount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
        if (isSearchExpanded) setIsSearchExpanded(false);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    // RESTORED: Initially hide the STUDIO text
    if (studioRef.current) {
      gsap.set(studioRef.current, {
        opacity: 0,
        y: -10,
        height: 0
      });
    }

    // RESTORED: Initially hide the logo text
    if (logoTextRef.current) {
      gsap.set(logoTextRef.current, {
        opacity: 0,
        x: -20,
        width: 0,
        overflow: 'hidden'
      });
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isSearchExpanded]);

  useEffect(() => {
    if (isSearchExpanded && searchInputRef.current) {
      gsap.to(searchInputRef.current, {
        width: '180px',
        opacity: 1,
        duration: 0.3, // Faster (snappy)
        ease: 'power2.out',
        onComplete: () => searchInputRef.current?.focus()
      });
      gsap.to('.search-container', {
        width: '240px',
        borderColor: 'rgba(255,255,255,0.3)',
        duration: 0.3, // Faster
        ease: 'power2.out'
      });
    } else if (searchInputRef.current) {
      gsap.to(searchInputRef.current, {
        width: 0,
        opacity: 0,
        duration: 0.2, // Faster
        ease: 'power2.in'
      });
      gsap.to('.search-container', {
        width: 'auto',
        borderColor: 'rgba(255,255,255,0.1)',
        duration: 0.2, // Faster
        ease: 'power2.in'
      });
    }
  }, [isSearchExpanded]);

  const handleLogoMouseEnter = () => {
    // Show main logo text
    if (logoTextRef.current) {
      gsap.to(logoTextRef.current, {
        opacity: 1,
        x: 0,
        width: 'auto',
        duration: 0.5,
        ease: 'power2.out'
      });
    }

    // Show STUDIO text after a slight delay
    if (studioRef.current) {
      gsap.to(studioRef.current, {
        opacity: 1,
        y: 0,
        height: 'auto',
        duration: 0.4,
        delay: 0.2,
        ease: 'power2.out'
      });
    }
  };

  const handleLogoMouseLeave = () => {
    // Hide STUDIO text first
    if (studioRef.current) {
      gsap.to(studioRef.current, {
        opacity: 0,
        y: -10,
        height: 0,
        duration: 0.3,
        ease: 'power2.in'
      });
    }

    // Hide main logo text
    if (logoTextRef.current) {
      gsap.to(logoTextRef.current, {
        opacity: 0,
        x: -20,
        width: 0,
        duration: 0.3,
        ease: 'power2.in'
      });
    }
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Left Side - Logo with 3D Particle Cube */}
        <Link href="/" className="logo-link">
          <div
            className="logo"
            onMouseEnter={handleLogoMouseEnter}
            onMouseLeave={handleLogoMouseLeave}
          >
            <div className="particle-cube-area">
              <ParticleCubeLogo />
            </div>
            <div ref={logoTextRef} className="logo-text-container">
              <span className="logo-text">MAKERS</span>
              <span className="logo-text-3d">3D</span>
              <span ref={studioRef} className="logo-text-studio">STUDIO</span>
            </div>
          </div>
        </Link>

        {/* Right Side Icons */}
        <div className="nav-icons flex items-center gap-3">
          <div className="search-container flex items-center relative h-10 px-2 rounded-full bg-white/5 border border-white/10 group transition-all duration-300">
            <button
              className="nav-icon !p-0 z-10"
              aria-label="Search"
              onClick={() => setIsSearchExpanded(!isSearchExpanded)}
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search creations..."
              className="bg-transparent border-none outline-none text-[10px] uppercase tracking-[0.2em] font-light placeholder:text-white/20 text-white w-0 opacity-0 overflow-hidden transition-all duration-500 ease-in-out"
              style={{ paddingLeft: isSearchExpanded ? '12px' : '0' }}
            />
          </div>

          {/* User Icon - Always Visible */}
          <div className="user-menu-container">
            <button
              className="nav-icon user-button"
              aria-label="User Account"
              onClick={() => {
                if (session) {
                  setShowUserMenu(!showUserMenu);
                } else {
                  router.push('/login');
                }
              }}
            >
              {session?.user?.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name || 'User'}
                  className="user-avatar"
                />
              ) : (
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              )}
            </button>

            {/* Dropdown - Only show when logged in AND menu is open */}
            {session && showUserMenu && (
              <div className="user-dropdown">
                <div className="user-info">
                  <div className="user-name">{session.user?.name}</div>
                  <div className="user-email">{session.user?.email}</div>
                </div>
                <div className="dropdown-divider"></div>
                <button
                  className="dropdown-item"
                  onClick={() => {
                    setShowUserMenu(false);
                    router.push('/profile');
                  }}
                >
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  My Profile
                </button>
                <button
                  className="dropdown-item logout"
                  onClick={() => {
                    setShowUserMenu(false);
                    signOut({ callbackUrl: '/' });
                  }}
                >
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign Out
                </button>
              </div>
            )}
          </div>
          <button className="nav-icon" aria-label="Favorites">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>

          {/* Cart Icon Button with Badge - ALWAYS VISIBLE */}
          <Link
            href="/cart"
            className="nav-icon"
            aria-label="Cart"
            style={{ opacity: 1, visibility: 'visible' }}
          >
            <div className="cart-icon-wrapper">
              <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                width="20"
                height="20"
                className="cart-svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="cart-badge">{cartCount}</span>
              )}
            </div>
          </Link>


        </div>
      </div>

      <style jsx>{`

        .navbar {
          background-color: #000000;
          padding: 0.5rem 0;
          position: sticky;
          top: 0;
          z-index: 1000;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: visible;
        }

        .navbar.scrolled {
          background-color: rgba(0, 0, 0, 0.95);
          backdrop-filter: blur(10px);
          box-shadow: 0 2px 20px rgba(0, 0, 0, 0.5);
          padding: 0.5rem 0;
        }

        .navbar-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: visible;
        }

        .logo-link {
          text-decoration: none;
          display: flex;
          align-items: center;
          pointer-events: auto;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 0;
          position: relative;
        }

        .particle-cube-area {
          width: 60px;
          height: 60px;
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
          position: relative;
          z-index: 9999;
        }

        .particle-cube-area canvas {
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
        }

        .navbar.scrolled .particle-cube-area {
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
          transform: scale(1.1);
          filter: drop-shadow(0 0 15px rgba(255, 255, 255, 0.4));
        }

        .navbar.scrolled .particle-cube-area canvas {
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
        }

        .logo-text-container {
          display: flex;
          flex-direction: column;
          gap: 0;
          line-height: 1;
          position: absolute;
          left: calc(100% + 1rem);
          white-space: nowrap;
          transition: opacity 0.4s ease, transform 0.4s ease;
        }

        .navbar.scrolled .logo-text-container {
          opacity: 0 !important;
          transform: translateX(-10px);
          pointer-events: none;
        }

        .logo-text {
          font-size: 1.4rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          line-height: 0.9;
          color: #ffffff;
        }

        .logo-text-3d {
          font-size: 1.4rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          line-height: 0.9;
          color: #ffffff;
        }

        .logo-text-studio {
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          margin-top: 0.1rem;
          overflow: hidden;
          color: #ffffff;
        }

        .nav-icons {
          display: flex;
          gap: 0.75rem;
          align-items: center;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          flex-shrink: 0;
        }

        .navbar.scrolled .nav-icons {
          opacity: 0;
          transform: translateX(20px);
          pointer-events: none;
        }



        .nav-icon {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.4rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: 6px;
          text-decoration: none;
          position: relative;
        }

        .nav-icon::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 6px;
          background: rgba(179, 179, 179, 0.05);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .nav-icon:hover::before {
          opacity: 1;
        }

        .nav-icon svg {
          width: 20px;
          height: 20px;
          color: #b3b3b3ff;
          stroke-width: 1.5;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          z-index: 1;
        }

        .nav-icon:hover svg {
          color: #ffffff;
          transform: translateY(-1px);
        }

        .nav-icon:active svg {
          transform: translateY(0);
        }

        .user-menu-container {
          position: relative;
        }

        .user-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid rgba(255, 255, 255, 0.2);
          transition: border-color 0.3s ease;
        }

        .user-button:hover .user-avatar {
          border-color: rgba(255, 255, 255, 0.5);
        }

        .user-dropdown {
          position: absolute;
          top: calc(100% + 1rem);
          right: 0;
          background: rgba(20, 20, 20, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          min-width: 220px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
          animation: dropdownSlide 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
          z-index: 1000;
        }

        @keyframes dropdownSlide {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .user-info {
          padding: 1rem;
        }

        .user-name {
          font-size: 0.95rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 0.25rem;
        }

        .user-email {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.5);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .dropdown-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          margin: 0.5rem 0;
        }

        .dropdown-item {
          width: 100%;
          padding: 0.75rem 1rem;
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.875rem;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .dropdown-item svg {
          width: 18px;
          height: 18px;
          color: rgba(255, 255, 255, 0.6);
        }

        .dropdown-item:hover {
          background: rgba(255, 255, 255, 0.05);
          color: #ffffff;
        }

        .dropdown-item:hover svg {
          color: #ffffff;
        }

        .dropdown-item.logout {
          color: rgba(239, 68, 68, 0.8);
        }

        .dropdown-item.logout svg {
          color: rgba(239, 68, 68, 0.6);
        }

        .dropdown-item.logout:hover {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }

        .dropdown-item.logout:hover svg {
          color: #ef4444;
        }

        .cart-icon-wrapper {
          position: relative;
          display: inline-block;
          width: 20px;
          height: 20px;
        }

        .cart-svg {
          display: block;
          width: 20px;
          height: 20px;
          color: #b3b3b3ff;
          stroke-width: 1.5;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .nav-icon:hover .cart-svg {
          color: #ffffff;
          transform: translateY(-1px);
        }

        .cart-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background: #ef4444;
          color: white;
          font-size: 9px;
          font-weight: 700;
          min-width: 16px;
          height: 16px;
          line-height: 1;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 3px;
          box-shadow: 0 2px 8px rgba(239, 68, 68, 0.6);
          animation: badgePulse 2s infinite;
          z-index: 10;
          border: 2px solid #000;
          pointer-events: none;
        }

        @keyframes badgePulse {
          0%, 100% {
            box-shadow: 0 2px 8px rgba(239, 68, 68, 0.4);
          }
          50% {
            box-shadow: 0 2px 12px rgba(239, 68, 68, 0.6);
          }
        }

        @media (max-width: 768px) {
          .navbar-container {
            padding: 0 1rem;
          }

          .logo-text {
            font-size: 1.2rem;
          }

          .logo-text-3d {
            font-size: 1.2rem;
          }

          .particle-cube-area {
            width: 50px !important;
            height: 50px !important;
          }

          .navbar.scrolled .particle-cube-area {
            display: block !important;
            opacity: 1 !important;
            visibility: visible !important;
          }

          .nav-icons {
            gap: 0.5rem;
          }

          .nav-icon {
            padding: 0.35rem;
          }

          .nav-icon svg {
            width: 19px;
            height: 19px;
          }

          .cart-badge {
            font-size: 8px;
            min-width: 14px;
            height: 14px;
            border-width: 1.5px;
            top: -3px;
            right: -3px;
          }

          .cart-icon-wrapper {
            width: 19px;
            height: 19px;
          }

          .cart-svg {
            width: 19px;
            height: 19px;
          }
        }


        @media (max-width: 480px) {
          .logo-text {
            font-size: 1rem;
          }

          .logo-text-3d {
            font-size: 1rem;
          }

          .particle-cube-area {
            width: 45px !important;
            height: 45px !important;
          }

          .navbar.scrolled .particle-cube-area {
            display: block !important;
            opacity: 1 !important;
            visibility: visible !important;
          }

          .nav-icons {
            gap: 0.4rem;
          }

          .nav-icon {
            padding: 0.3rem;
          }

          .nav-icon svg {
            width: 18px;
            height: 18px;
          }

          .cart-badge {
            font-size: 7px;
            min-width: 13px;
            height: 13px;
            border-width: 1.5px;
            top: -2px;
            right: -2px;
          }

          .cart-icon-wrapper {
            width: 18px;
            height: 18px;
          }

          .cart-svg {
            width: 18px;
            height: 18px;
          }
        }
      `}</style>
    </nav >
  );
}
