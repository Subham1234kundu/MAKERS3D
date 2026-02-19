import type { Metadata } from "next";
import { SITE_URL, defaultOpenGraph, defaultTwitter } from "../lib/seo";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "MAKERS3D terms of service. Terms and conditions for using our 3D printing services and website.",
  keywords: ["MAKERS3D terms", "terms of service", "conditions"],
  alternates: { canonical: `${SITE_URL}/terms` },
  openGraph: {
    ...defaultOpenGraph,
    url: `${SITE_URL}/terms`,
    title: "Terms of Service | MAKERS3D",
    description: "Terms and conditions for using MAKERS3D services.",
  },
  twitter: {
    ...defaultTwitter,
    title: "Terms of Service | MAKERS3D",
    description: "Terms and conditions for using MAKERS3D services.",
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
