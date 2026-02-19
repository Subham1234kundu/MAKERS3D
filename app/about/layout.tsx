import type { Metadata } from "next";
import { SITE_URL, defaultOpenGraph, defaultTwitter } from "../lib/seo";

export const metadata: Metadata = {
  title: "About MAKERS3D",
  description:
    "MAKERS3D is India's premier 3D printing studio. Learn about our mission, craftsmanship, and commitment to delivering premium industrial-grade 3D printed products.",
  keywords: [
    "about MAKERS3D",
    "3D printing studio India",
    "MAKERS3D story",
    "premium 3D printing",
  ],
  alternates: { canonical: `${SITE_URL}/about` },
  openGraph: {
    ...defaultOpenGraph,
    url: `${SITE_URL}/about`,
    title: "About MAKERS3D | India's Premier 3D Printing Studio",
    description: "Learn about our mission and craftsmanship in premium 3D printing.",
  },
  twitter: {
    ...defaultTwitter,
    title: "About MAKERS3D | India's Premier 3D Printing Studio",
    description: "Learn about our mission and craftsmanship in premium 3D printing.",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
