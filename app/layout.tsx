import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { ThemeProvider } from "./providers/ThemeProvider";
import { CartProvider } from "./providers/CartProvider";
import SessionProvider from "./providers/SessionProvider";
import CustomCursor from "./components/CustomCursor";
import ChatButton from "./components/ChatButton";
import LoadingScreen from "./components/LoadingScreen";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "MAKERS3D | Premium 3D Creations",
    template: "%s | MAKERS3D"
  },
  description: "MAKERS3D is India's premier 3D printing studio. Shop high-quality, professional 3D printed creations, architectural models, and elite desktop accessories. We deliver unmatched industrial-grade precision for every masterpiece.",
  keywords: ["MAKERS3D", "Premium 3D Prints", "3D Printing India", "Architectural 3D Models", "High-Quality 3D Printing", "Desktop Accessories", "Home Decors", "Makers 3D Studio", "Elite 3D Art"],
  authors: [{ name: "MAKERS3D Team" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://makers3d.in",
    siteName: "MAKERS3D",
    title: "MAKERS3D | Premium 3D Creations",
    description: "Experience the pinnacle of 3D craftsmanship. We deliver premium, industrial-grade 3D printed products across India.",
    images: [
      {
        url: "/images/logo.png",
        width: 1200,
        height: 630,
        alt: "MAKERS3D Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MAKERS3D | Premium 3D Creations",
    description: "Shop premium 3D printed masterpieces. High-quality art, models, and decor.",
    images: ["/images/logo.png"],
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
        <link rel="canonical" href="https://makers3d.in" />
        <script
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
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Store",
              "name": "MAKERS3D",
              "url": "https://makers3d.in",
              "logo": "https://makers3d.in/images/logo.png",
              "description": "India's premier 3D printing studio specializing in premium architectural models and elite desktop masterpieces.",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "IN"
              },
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://makers3d.in/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <LoadingScreen />
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
