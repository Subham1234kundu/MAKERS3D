import type { Metadata } from "next";
import { SITE_URL, defaultOpenGraph, defaultTwitter } from "../lib/seo";

export const metadata: Metadata = {
  title: "Create Account",
  description:
    "Create your MAKERS3D account. Shop premium 3D prints, track orders, save favorites, and get exclusive offers.",
  alternates: { canonical: `${SITE_URL}/signup` },
  robots: { index: false, follow: true },
  openGraph: {
    ...defaultOpenGraph,
    url: `${SITE_URL}/signup`,
    title: "Create Account | MAKERS3D",
  },
  twitter: { ...defaultTwitter, title: "Create Account | MAKERS3D" },
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
