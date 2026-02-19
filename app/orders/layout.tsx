import type { Metadata } from "next";
import { SITE_URL, defaultOpenGraph, defaultTwitter } from "../lib/seo";

export const metadata: Metadata = {
  title: "My Orders",
  description: "View and track your MAKERS3D orders. Order history and status.",
  alternates: { canonical: `${SITE_URL}/orders` },
  robots: { index: false, follow: true },
  openGraph: {
    ...defaultOpenGraph,
    url: `${SITE_URL}/orders`,
    title: "My Orders | MAKERS3D",
  },
  twitter: { ...defaultTwitter, title: "My Orders | MAKERS3D" },
};

export default function OrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
