/**
 * Centralized SEO metadata for MAKERS3D
 * Used across layouts for consistent meta tags
 */
export const SITE_URL = "https://makers3d.in";

export const defaultOpenGraph = {
  type: "website" as const,
  locale: "en_IN" as const,
  siteName: "MAKERS3D",
  images: [
    {
      url: "/images/logo.png",
      width: 1200,
      height: 630,
      alt: "MAKERS3D - Premium 3D Creations",
    },
  ],
};

export const defaultTwitter = {
  card: "summary_large_image" as const,
  images: ["/images/logo.png"],
};
