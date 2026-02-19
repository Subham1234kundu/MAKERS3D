import type { Metadata } from "next";
import { SITE_URL, defaultOpenGraph, defaultTwitter } from "../lib/seo";

export const metadata: Metadata = {
  title: "My Profile",
  description: "Manage your MAKERS3D profile, addresses, and account settings.",
  alternates: { canonical: `${SITE_URL}/profile` },
  robots: { index: false, follow: true },
  openGraph: {
    ...defaultOpenGraph,
    url: `${SITE_URL}/profile`,
    title: "My Profile | MAKERS3D",
  },
  twitter: { ...defaultTwitter, title: "My Profile | MAKERS3D" },
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
