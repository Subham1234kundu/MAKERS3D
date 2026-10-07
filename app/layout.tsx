import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { ThemeProvider } from "./providers/ThemeProvider";
import { CartProvider } from "./providers/CartProvider";
import SessionProvider from "./providers/SessionProvider";
import CustomCursor from "./components/CustomCursor";
import ChatButton from "./components/ChatButton";
import "./globals.css";
import { BRAND_ALIASES, HOME_DESCRIPTION, HOME_TITLE, SITE_URL, defaultOpenGraph, defaultTwitter, jsonLd } from './lib/seo';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: HOME_TITLE,
    template: "%s | MAKERS3D"
  },
  description: HOME_DESCRIPTION,
  authors: [{ name: "MAKERS3D Team" }],
  openGraph: {
    ...defaultOpenGraph,
    url: SITE_URL,
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
  },
  twitter: {
    ...defaultTwitter,
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  verification: process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : undefined,
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/images/logo.png", sizes: "32x32", type: "image/png" },
      { url: "/images/logo.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/images/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head suppressHydrationWarning>
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('theme');
                const isDark = theme === 'dark' || 
                  (theme !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches);
                
                if (isDark) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              })();
            `,
          }}
        />
        <script
          id="structured-data"
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: jsonLd({
              "@context": "https://schema.org",
              "@type": "Organization",
              "@id": "https://makers3d.in/#organization",
              "name": "MAKERS3D",
              "alternateName": BRAND_ALIASES,
              "url": "https://makers3d.in",
              "logo": "https://makers3d.in/images/logo.png",
              "description": HOME_DESCRIPTION,
              "email": "studio@makers3d.in"
            })
          }}
        />
        {/* Google Analytics GA4 */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-5HEM6D2QMW"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-5HEM6D2QMW', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <CustomCursor />
        <div suppressHydrationWarning>
          <SessionProvider>
            <ThemeProvider>
              <CartProvider>
                {children}
                <ChatButton />
              </CartProvider>
            </ThemeProvider>
          </SessionProvider>
        </div>

      </body>
    </html>

  );
}
