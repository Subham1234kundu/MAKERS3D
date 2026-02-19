import type { Metadata } from "next";
import { SITE_URL, defaultOpenGraph, defaultTwitter } from "../lib/seo";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Set a new password for your MAKERS3D account.",
  alternates: { canonical: `${SITE_URL}/reset-password` },
  robots: { index: false, follow: true },
  openGraph: {
    ...defaultOpenGraph,
    url: `${SITE_URL}/reset-password`,
    title: "Reset Password | MAKERS3D",
  },
  twitter: { ...defaultTwitter, title: "Reset Password | MAKERS3D" },
};

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
