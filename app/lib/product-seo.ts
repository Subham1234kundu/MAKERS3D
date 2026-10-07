import type { CatalogProduct, CatalogVariant } from '../../lib/catalog';
import { SITE_URL, breadcrumbs } from './seo';

export function plainText(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/gi, ' ').replace(/&amp;/gi, '&').replace(/\s+/g, ' ').trim();
}

export function productDescription(product: CatalogProduct): string {
  const text = plainText(product.shortDescription) || `Shop ${plainText(product.name)} by MAKERS3D. View photos, prices and details of this 3D printed product, then order online.`;
  if (text.length <= 160) return text;
  const excerpt = text.slice(0, 157);
  return `${excerpt.slice(0, excerpt.lastIndexOf(' ')) || excerpt}…`;
}

export function productImageUrls(product: CatalogProduct): string[] {
  return product.images.flatMap(image => {
    const source = typeof image === 'string' ? image : image.url;
    if (!source) return [];
    try {
      const url = new URL(source, SITE_URL);
      return /^https?:$/.test(url.protocol) ? [url.href] : [];
    } catch { return []; }
  });
}

function firstVariant(variants: CatalogProduct['sizes']): CatalogVariant | undefined {
  return Array.isArray(variants) && typeof variants[0] === 'object' ? variants[0] : undefined;
}

export function defaultProductPrice(product: CatalogProduct): number {
  let price = product.price;
  for (const variants of [product.sizes, product.colors]) {
    const variantPrice = Number(firstVariant(variants)?.price);
    if (variantPrice > 0 && Number.isFinite(variantPrice)) price = variantPrice;
  }
  return price;
}

export function productStructuredData(product: CatalogProduct) {
  const path = `/products/${product.id}`;
  const url = `${SITE_URL}${path}`;
  const images = productImageUrls(product);
  const price = defaultProductPrice(product);
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Product',
        '@id': `${url}#product`,
        url,
        name: plainText(product.name),
        description: plainText(product.description) || productDescription(product),
        ...(images.length ? { image: images } : {}),
        sku: product.id,
        brand: { '@type': 'Brand', name: 'MAKERS3D' },
        ...(price > 0 ? {
          offers: {
            '@type': 'Offer',
            url,
            priceCurrency: 'INR',
            price,
            seller: { '@id': `${SITE_URL}/#organization` },
          },
        } : {}),
      },
      breadcrumbs([{ name: 'Home', path: '/' }, { name: 'Products', path: '/products' }, { name: product.name, path }]),
    ],
  };
}

export function catalogStructuredData(products: CatalogProduct[], path: string, name: string) {
  const url = `${SITE_URL}${path}`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${url}#webpage`,
        url,
        name,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        mainEntity: { '@id': `${url}#catalog` },
      },
      {
        '@type': 'ItemList',
        '@id': `${url}#catalog`,
        numberOfItems: products.length,
        itemListElement: products.map((product, index) => ({
          '@type': 'ListItem', position: index + 1, name: product.name, url: `${SITE_URL}/products/${product.id}`,
        })),
      },
      breadcrumbs([{ name: 'Home', path: '/' }, { name, path }]),
    ],
  };
}
