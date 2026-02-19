import type { Metadata } from "next";
import { SITE_URL, defaultOpenGraph, defaultTwitter } from "../lib/seo";

export const metadata: Metadata = {
  title: "My Favorites",
  description: "Your saved favorite 3D prints from MAKERS3D. Quick access to items you love.",
  alternates: { canonical: `${SITE_URL}/likes` },
  robots: { index: false, follow: true },
  openGraph: {
    ...defaultOpenGraph,
    url: `${SITE_URL}/likes`,
    title: "My Favorites | MAKERS3D",
  },
  twitter: { ...defaultTwitter, title: "My Favorites | MAKERS3D" },
};

export default function LikesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
