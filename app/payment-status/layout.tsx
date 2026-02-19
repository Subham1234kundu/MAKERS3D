import type { Metadata } from "next";
import { SITE_URL, defaultOpenGraph, defaultTwitter } from "../lib/seo";

export const metadata: Metadata = {
  title: "Payment Status",
  description: "Check your MAKERS3D payment status and order completion.",
  alternates: { canonical: `${SITE_URL}/payment-status` },
  robots: { index: false, follow: true },
  openGraph: {
    ...defaultOpenGraph,
    url: `${SITE_URL}/payment-status`,
    title: "Payment Status | MAKERS3D",
  },
  twitter: { ...defaultTwitter, title: "Payment Status | MAKERS3D" },
};

export default function PaymentStatusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
