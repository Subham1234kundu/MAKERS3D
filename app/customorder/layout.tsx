import type { Metadata } from "next";
import { SITE_URL, defaultOpenGraph, defaultTwitter } from "../lib/seo";

export const metadata: Metadata = {
  title: "Custom 3D Printing Order",
  description:
    "Get your custom 3D printing order from MAKERS3D. Upload your 3D model or design and we'll create a unique, high-quality 3D printed piece. Free quote.",
  keywords: [
    "custom 3D printing",
    "3D print on demand",
    "custom 3D models",
    "3D printing service India",
    "personalized 3D prints",
  ],
  alternates: { canonical: `${SITE_URL}/customorder` },
  openGraph: {
    ...defaultOpenGraph,
    url: `${SITE_URL}/customorder`,
    title: "Custom 3D Printing Order | MAKERS3D",
    description: "Get custom 3D printed creations. Upload your design for a free quote.",
  },
  twitter: {
    ...defaultTwitter,
    title: "Custom 3D Printing Order | MAKERS3D",
    description: "Get custom 3D printed creations. Upload your design for a free quote.",
  },
};

export default function CustomOrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
