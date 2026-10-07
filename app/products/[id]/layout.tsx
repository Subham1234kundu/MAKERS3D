import type { Metadata } from 'next';
import { getCatalogProduct, LEGACY_CATEGORY_SLUGS } from '../../../lib/catalog';
import { plainText, productDescription, productImageUrls } from '../../lib/product-seo';
import { pageMetadata } from '../../lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  if (LEGACY_CATEGORY_SLUGS.includes(id.toLowerCase())) {
    return pageMetadata({ title: '3D Printed Products | MAKERS3D', description: 'Browse 3D printed figurines, lamps, frames and gifts from MAKERS3D.', path: '/products' });
  }
  const product = await getCatalogProduct(id);
  if (!product) {
    return { title: 'Product Not Found', robots: { index: false, follow: true, googleBot: { index: false, follow: true } } };
  }
  return pageMetadata({
    title: plainText(product.name) + ' | MAKERS3D',
    description: productDescription(product),
    path: '/products/' + product.id,
    image: productImageUrls(product)[0],
    imageAlt: product.name,
  });
}

export default function ProductDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
