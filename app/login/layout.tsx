import type { Metadata } from "next";
import { SITE_URL, defaultOpenGraph, defaultTwitter } from "../lib/seo";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your MAKERS3D account to track orders, manage profile, and access exclusive offers.",
  alternates: { canonical: `${SITE_URL}/login` },
  robots: { index: false, follow: true },
  openGraph: {
    ...defaultOpenGraph,
    url: `${SITE_URL}/login`,
    title: "Login | MAKERS3D",
  },
  twitter: { ...defaultTwitter, title: "Login | MAKERS3D" },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
