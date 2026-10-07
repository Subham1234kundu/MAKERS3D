import { cache } from 'react';
import { ObjectId, type Document } from 'mongodb';
import { getDatabase } from './mongodb';

export const LEGACY_CATEGORY_SLUGS = ['divine', 'love', 'custom', 'ash_and_stone', 'aura', 'motion', 'box', 'all'];

export type CatalogImage = string | { url?: string; alt?: string };
export type CatalogVariant = {
  name: string;
  price?: number | string;
  originalPrice?: number | string;
  images?: CatalogImage[];
};
export type CatalogProduct = {
  id: string;
  name: string;
  title?: string;
  description?: string;
  shortDescription?: string;
  price: number;
  originalPrice: number;
  category?: string;
  subCategory?: string;
  image?: string;
  images: CatalogImage[];
  sizes?: (CatalogVariant | string)[] | string;
  colors?: (CatalogVariant | string)[] | string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
};

/** Match the public catalogue API's starting price and image fallback. */
function normalizeProduct(raw: Document): CatalogProduct {
  const product = JSON.parse(JSON.stringify(raw));
  let price = Number(product.price) || 0;
  let originalPrice = Number(product.originalPrice) || 0;
  if (Array.isArray(product.sizes)) {
    const variantPrices = product.sizes.map((size: CatalogVariant) => Number(size.price)).filter((value: number) => Number.isFinite(value) && value > 0);
    if (variantPrices.length) {
      const minimum = Math.min(...(price > 0 ? [price, ...variantPrices] : variantPrices));
      if (minimum !== price) {
        const variant = product.sizes.find((size: CatalogVariant) => Number(size.price) === minimum);
        price = minimum;
        originalPrice = Number(variant?.originalPrice) || originalPrice;
      }
    }
  }
  let images: CatalogImage[] = Array.isArray(product.images) ? product.images : product.image ? [product.image] : [];
  if (!images.length && Array.isArray(product.colors)) {
    const color = product.colors.find((variant: CatalogVariant) => variant.images?.length);
    if (color) images = color.images;
  }
  return { ...product, id: raw._id.toString(), name: product.name || product.title || '3D printed product', price, originalPrice, images };
}

// React cache deduplicates metadata and page reads within the same request.
export const getCatalog = cache(async (): Promise<CatalogProduct[]> => {
  const db = await getDatabase('makers3d_db');
  const products = await db.collection('products').find({}).sort({ createdAt: -1 }).toArray();
  return products.map(normalizeProduct);
});

export const getCatalogProduct = cache(async (id: string): Promise<CatalogProduct | null> => {
  const objectId = /^[a-fA-F0-9]{24}$/.test(id);
  if (!objectId && !/^\d+$/.test(id)) return null;
  const db = await getDatabase('makers3d_db');
  const product = await db.collection('products').findOne(objectId ? { _id: new ObjectId(id) } : { id: Number(id) });
  return product ? normalizeProduct(product) : null;
});
