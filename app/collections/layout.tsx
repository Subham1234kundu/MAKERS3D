import type { Metadata } from "next";
import { pageMetadata } from "../lib/seo";

export const metadata: Metadata = pageMetadata({
  title: '3D Printed Collections: Figurines, Lamps & Frames | MAKERS3D',
  description: 'Explore MAKERS3D collections of 3D printed figurines, table lamps and photo frames. Filter by product type to find decor or a gift for your space.',
  path: '/collections',
});

export default function CollectionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
