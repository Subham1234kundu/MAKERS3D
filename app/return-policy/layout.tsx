import type { Metadata } from "next";
import { SITE_URL, defaultOpenGraph, defaultTwitter } from "../lib/seo";

export const metadata: Metadata = {
  title: "Return & Refund Policy",
  description:
    "MAKERS3D return and refund policy. Hassle-free returns on 3D printed products. Learn about our refund process and conditions.",
  keywords: ["3D print returns", "MAKERS3D refund", "return policy"],
  alternates: { canonical: `${SITE_URL}/return-policy` },
  openGraph: {
    ...defaultOpenGraph,
    url: `${SITE_URL}/return-policy`,
    title: "Return & Refund Policy | MAKERS3D",
    description: "Hassle-free returns on premium 3D printed products.",
  },
  twitter: {
    ...defaultTwitter,
    title: "Return & Refund Policy | MAKERS3D",
    description: "Hassle-free returns on premium 3D printed products.",
  },
};

export default function ReturnPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
