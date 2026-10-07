import { MetadataRoute } from "next";
import { getDatabase } from "@/lib/mongodb";
import { SITE_URL } from "./lib/seo";

export const dynamic = 'force-dynamic';

function modifiedDate(value: unknown): Date | undefined {
  if (!(value instanceof Date) && typeof value !== 'string') return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL;

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/services`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/industries`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/contact`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/products`, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/collections`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/customorder`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/about`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/partner`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/shipping-policy`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/return-policy`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/privacy-policy`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/terms`, changeFrequency: "monthly", priority: 0.5 },
  ];

  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const db = await getDatabase("makers3d_db");
    const products = await db.collection("products").find({}).project({ _id: 1, updatedAt: 1, createdAt: 1 }).toArray();
    productRoutes = products.map((p) => {
      const lastModified = modifiedDate(p.updatedAt) || modifiedDate(p.createdAt);
      return {
        url: `${baseUrl}/products/${p._id.toString()}`,
        ...(lastModified ? { lastModified } : {}),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      };
    });
  } catch {
    console.error("Sitemap: Product catalogue temporarily unavailable");
  }

  return [...staticRoutes, ...productRoutes];
}
