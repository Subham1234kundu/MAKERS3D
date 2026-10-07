import { getCatalog } from '../../lib/catalog';
import { catalogStructuredData } from '../lib/product-seo';
import { jsonLd } from '../lib/seo';
import CollectionsClient from './CollectionsClient';

export const dynamic = 'force-dynamic';

export default async function CollectionsPage() {
  const products = await getCatalog();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(catalogStructuredData(products, '/collections', '3D Printed Collections')) }} />
      <CollectionsClient initialProducts={products} />
    </>
  );
}
