import { getCatalog } from '../../lib/catalog';
import { catalogStructuredData } from '../lib/product-seo';
import { jsonLd } from '../lib/seo';
import ProductsClient from './ProductsClient';

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  const products = await getCatalog();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(catalogStructuredData(products, '/products', '3D Printed Products')) }} />
      <ProductsClient initialProducts={products} />
    </>
  );
}
