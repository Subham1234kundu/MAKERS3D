import type { Metadata } from "next";
import { SITE_URL, defaultOpenGraph, defaultTwitter } from "../lib/seo";

export const metadata: Metadata = {
  title: "Partner with MAKERS3D",
  description:
    "Partner with India's premier 3D printing studio. Collaborate with MAKERS3D for bulk orders, B2B partnerships, and custom manufacturing solutions.",
  keywords: [
    "3D printing partnership",
    "B2B 3D printing",
    "bulk 3D printing",
    "MAKERS3D partner",
  ],
  alternates: { canonical: `${SITE_URL}/partner` },
  openGraph: {
    ...defaultOpenGraph,
    url: `${SITE_URL}/partner`,
    title: "Partner with MAKERS3D",
    description: "Collaborate with India's premier 3D printing studio for B2B and bulk orders.",
  },
  twitter: {
    ...defaultTwitter,
    title: "Partner with MAKERS3D",
    description: "Collaborate with India's premier 3D printing studio for B2B and bulk orders.",
  },
};

export default function PartnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
