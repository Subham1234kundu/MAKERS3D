import type { Metadata } from "next";
import { SITE_URL, defaultOpenGraph, defaultTwitter } from "../lib/seo";

export const metadata: Metadata = {
  title: "Shopping Cart",
  description: "Your MAKERS3D shopping cart. Review your premium 3D printed items before checkout.",
  alternates: { canonical: `${SITE_URL}/cart` },
  robots: { index: false, follow: true },
  openGraph: {
    ...defaultOpenGraph,
    url: `${SITE_URL}/cart`,
    title: "Shopping Cart | MAKERS3D",
  },
  twitter: { ...defaultTwitter, title: "Shopping Cart | MAKERS3D" },
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
