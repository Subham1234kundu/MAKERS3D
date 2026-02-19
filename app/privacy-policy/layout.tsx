import type { Metadata } from "next";
import { SITE_URL, defaultOpenGraph, defaultTwitter } from "../lib/seo";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "MAKERS3D privacy policy. How we collect, use, and protect your personal information when you shop with us.",
  keywords: ["MAKERS3D privacy", "data protection", "privacy policy"],
  alternates: { canonical: `${SITE_URL}/privacy-policy` },
  openGraph: {
    ...defaultOpenGraph,
    url: `${SITE_URL}/privacy-policy`,
    title: "Privacy Policy | MAKERS3D",
    description: "How we protect your data and privacy.",
  },
  twitter: {
    ...defaultTwitter,
    title: "Privacy Policy | MAKERS3D",
    description: "How we protect your data and privacy.",
  },
};

export default function PrivacyPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
