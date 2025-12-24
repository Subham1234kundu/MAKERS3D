'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';

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

          <button className="nav-icon" aria-label="User Account">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>
          <button className="nav-icon" aria-label="Favorites">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          <button className="nav-icon" aria-label="Add to Cart">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 13v4m-2-2h4" />
            </svg>
          </button>
          <Link href="/cart" className="nav-icon" aria-label="Shopping Cart">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
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
        }

        .navbar.scrolled {
          background-color: transparent;
          box-shadow: none;
          padding: 0.5rem 0;
          pointer-events: none;
        }

        .navbar-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
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
        }

        .logo-text-3d {
          font-size: 1.4rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          line-height: 0.9;
        }

        .logo-text-studio {
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          margin-top: 0.1rem;
          overflow: hidden;
        }

        .nav-icons {
          display: flex;
          gap: 0.75rem;
          align-items: center;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
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
        }

        @media (max-width: 480px) {
          .logo-text {
            font-size: 1rem;
          }

          .logo-text-3d {
            font-size: 1rem;
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
        }
      `}</style>
    </nav>
  );
}
