import type { Metadata } from "next";
import { SITE_URL, defaultOpenGraph, defaultTwitter } from "../lib/seo";

export const metadata: Metadata = {
  title: "Shop Premium 3D Prints",
  description:
    "Browse our collection of premium 3D printed products. Divine sculptures, love gifts, custom creations, architectural models, and elite desktop accessories. Free shipping across India.",
  keywords: [
    "buy 3D prints",
    "3D printed gifts",
    "3D models shop",
    "premium 3D prints India",
    "custom 3D printing",
    "architectural models",
  ],
  alternates: { canonical: `${SITE_URL}/products` },
  openGraph: {
    ...defaultOpenGraph,
    url: `${SITE_URL}/products`,
    title: "Shop Premium 3D Prints | MAKERS3D",
    description:
      "Browse premium 3D printed sculptures, gifts, and custom creations. India's #1 3D printing studio.",
  },
  twitter: {
    ...defaultTwitter,
    title: "Shop Premium 3D Prints | MAKERS3D",
    description: "Browse premium 3D printed sculptures, gifts, and custom creations.",
  },
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
