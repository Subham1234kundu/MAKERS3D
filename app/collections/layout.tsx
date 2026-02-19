import type { Metadata } from "next";
import { SITE_URL, defaultOpenGraph, defaultTwitter } from "../lib/seo";

export const metadata: Metadata = {
  title: "Collections",
  description:
    "Explore MAKERS3D collections: Divine, Love, Custom, Ash & Stone, Aura, Motion, and more. Curated premium 3D printed art and decor.",
  keywords: [
    "3D print collections",
    "divine 3D prints",
    "3D printed gifts collection",
    "MAKERS3D collections",
  ],
  alternates: { canonical: `${SITE_URL}/collections` },
  openGraph: {
    ...defaultOpenGraph,
    url: `${SITE_URL}/collections`,
    title: "Collections | MAKERS3D",
    description: "Explore curated collections of premium 3D printed art and decor.",
  },
  twitter: {
    ...defaultTwitter,
    title: "Collections | MAKERS3D",
    description: "Explore curated collections of premium 3D printed art and decor.",
  },
};

export default function CollectionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
