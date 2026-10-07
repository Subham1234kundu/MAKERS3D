import { notFound, permanentRedirect } from 'next/navigation';
import { getCatalogProduct, LEGACY_CATEGORY_SLUGS } from '../../../lib/catalog';
import { productStructuredData } from '../../lib/product-seo';
import { jsonLd } from '../../lib/seo';
import ProductDetailClient from './ProductDetailClient';

export const dynamic = 'force-dynamic';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (LEGACY_CATEGORY_SLUGS.includes(id.toLowerCase())) permanentRedirect('/products');
  const product = await getCatalogProduct(id);
  if (!product) notFound();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(productStructuredData(product)) }} />
      <ProductDetailClient key={product.id} initialProduct={product} />
    </>
  );
}
