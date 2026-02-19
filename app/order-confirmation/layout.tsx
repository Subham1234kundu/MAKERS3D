import type { Metadata } from "next";
import { SITE_URL, defaultOpenGraph, defaultTwitter } from "../lib/seo";

export const metadata: Metadata = {
  title: "Order Confirmed",
  description: "Your MAKERS3D order has been confirmed. Thank you for your purchase.",
  alternates: { canonical: `${SITE_URL}/order-confirmation` },
  robots: { index: false, follow: true },
  openGraph: {
    ...defaultOpenGraph,
    url: `${SITE_URL}/order-confirmation`,
    title: "Order Confirmed | MAKERS3D",
  },
  twitter: { ...defaultTwitter, title: "Order Confirmed | MAKERS3D" },
};

export default function OrderConfirmationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
