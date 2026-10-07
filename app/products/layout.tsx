import type { Metadata } from "next";
import { pageMetadata } from "../lib/seo";

export const metadata: Metadata = pageMetadata({
  title: '3D Printed Products, Decor & Gifts | MAKERS3D',
  description: 'Shop MAKERS3D 3D printed products, including figurines, lamps, photo frames and gifts. Browse designs, product details and prices online.',
  path: '/products',
});

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
