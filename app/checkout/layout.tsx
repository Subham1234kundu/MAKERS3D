import type { Metadata } from "next";
import { SITE_URL, defaultOpenGraph, defaultTwitter } from "../lib/seo";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your MAKERS3D order. Secure checkout with multiple payment options.",
  alternates: { canonical: `${SITE_URL}/checkout` },
  robots: { index: false, follow: true },
  openGraph: {
    ...defaultOpenGraph,
    url: `${SITE_URL}/checkout`,
    title: "Checkout | MAKERS3D",
  },
  twitter: { ...defaultTwitter, title: "Checkout | MAKERS3D" },
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
