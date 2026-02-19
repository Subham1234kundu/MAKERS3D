import type { Metadata } from "next";
import { SITE_URL, defaultOpenGraph, defaultTwitter } from "../lib/seo";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your MAKERS3D account password. Enter your email to receive a reset link.",
  alternates: { canonical: `${SITE_URL}/forgot-password` },
  robots: { index: false, follow: true },
  openGraph: {
    ...defaultOpenGraph,
    url: `${SITE_URL}/forgot-password`,
    title: "Forgot Password | MAKERS3D",
  },
  twitter: { ...defaultTwitter, title: "Forgot Password | MAKERS3D" },
};

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
