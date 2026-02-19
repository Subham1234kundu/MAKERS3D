import type { Metadata } from "next";
import { SITE_URL, defaultOpenGraph, defaultTwitter } from "../lib/seo";

export const metadata: Metadata = {
  title: "Shipping Policy",
  description:
    "MAKERS3D shipping policy. Free shipping across India on premium 3D printed products. Delivery timelines, packaging, and tracking information.",
  keywords: ["3D printing shipping", "MAKERS3D delivery", "free shipping India"],
  alternates: { canonical: `${SITE_URL}/shipping-policy` },
  openGraph: {
    ...defaultOpenGraph,
    url: `${SITE_URL}/shipping-policy`,
    title: "Shipping Policy | MAKERS3D",
    description: "Free shipping across India. Learn about our delivery and packaging.",
  },
  twitter: {
    ...defaultTwitter,
    title: "Shipping Policy | MAKERS3D",
    description: "Free shipping across India. Learn about our delivery and packaging.",
  },
};

export default function ShippingPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
