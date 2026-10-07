import { unstable_noStore as noStore } from 'next/cache';
import { getDatabase } from '@/lib/mongodb';

export type ShowcaseProduct = {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string | null;
};

/** Normalise the many shapes an image can take across the products collection. */
function pickImage(p: Record<string, unknown>): string | null {
  const direct = (p.images as { url?: string }[] | undefined)?.find((i) => i?.url)?.url;
  if (direct) return direct;

  const single = p.image as string | { url?: string } | undefined;
  if (typeof single === 'string') return single;
  if (single?.url) return single.url;

  // Some products only carry imagery on their colour variants.
  const colours = p.colors as { images?: { url?: string }[] }[] | undefined;
  for (const c of colours ?? []) {
    const url = c.images?.find((i) => i?.url)?.url;
    if (url) return url;
  }

  return null;
}

/**
 * Reads the newest collection pieces straight from MongoDB at request time.
 * Server-side so the products are in the HTML for crawlers, unlike the old
 * client-side fetch. Failures degrade to an empty list — the landing page
 * must never 500 because the database is briefly unreachable.
 */
export async function getShowcaseProducts(limit = 4): Promise<ShowcaseProduct[]> {
  // Opt out of the full-route cache: products uploaded from the admin panel
  // must appear on the landing page without a redeploy.
  noStore();

  try {
    const db = await getDatabase('makers3d_db');
    const docs = await db
      .collection('products')
      .find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();

    return docs
      .map((p) => ({
        id: p._id.toString(),
        name: (p.name as string) || (p.title as string) || 'Untitled piece',
        category: (p.category as string) || 'Collection',
        price: Number(p.price) || 0,
        image: pickImage(p),
      }))
      .filter((p) => p.image);
  } catch (error) {
    console.error('[enterprise] showcase products unavailable:', error);
    return [];
  }
}
