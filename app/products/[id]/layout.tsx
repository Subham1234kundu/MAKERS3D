import type { Metadata } from "next";
import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { SITE_URL, defaultOpenGraph, defaultTwitter } from "../../lib/seo";

const CATEGORY_SLUGS = [
  "divine",
  "love",
  "custom",
  "ash_and_stone",
  "aura",
  "motion",
  "box",
  "all",
];

const CATEGORY_NAMES: Record<string, string> = {
  divine: "Divine Collection",
  love: "Love Collection",
  custom: "Custom Creations",
  ash_and_stone: "Ash & Stone",
  aura: "Aura Collection",
  motion: "Motion Collection",
  box: "Box Collection",
  all: "All Products",
};

function isValidObjectId(str: string) {
  return /^[a-fA-F0-9]{24}$/.test(str);
}

async function getProductOrCategory(id: string) {
  if (isValidObjectId(id)) {
    try {
      const db = await getDatabase("makers3d_db");
      const product = await db.collection("products").findOne({
        _id: new ObjectId(id),
      });
      return product ? { type: "product" as const, data: product } : null;
    } catch {
      return null;
    }
  }
  const slug = id.toLowerCase();
  if (CATEGORY_SLUGS.includes(slug)) {
    const name = CATEGORY_NAMES[slug] || slug;
    return { type: "category" as const, data: { name } };
  }
  return null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const result = await getProductOrCategory(id);

  const url = `${SITE_URL}/products/${id}`;

  if (result?.type === "product") {
    const p = result.data as any;
    const name = p.name || p.title || "Product";
    const desc =
      p.description ||
      p.shortDescription ||
      `${name} - Premium 3D printed creation from MAKERS3D. High-quality craftsmanship, free shipping across India.`;
    const img = p.images?.[0] || p.image;
    let imgUrl = typeof img === "object" ? img?.url : img;
    if (!imgUrl) imgUrl = "/images/logo.png";
    else if (!imgUrl.startsWith("http")) imgUrl = `${SITE_URL}${imgUrl.startsWith("/") ? "" : "/"}${imgUrl}`;

    return {
      title: name,
      description: desc,
      alternates: { canonical: url },
      openGraph: {
        ...defaultOpenGraph,
        url,
        title: `${name} | MAKERS3D`,
        description: desc,
        images: [{ url: imgUrl, width: 1200, height: 630, alt: name }],
      },
      twitter: {
        ...defaultTwitter,
        title: `${name} | MAKERS3D`,
        description: desc,
        images: [imgUrl],
      },
    };
  }

  if (result?.type === "category") {
    const name = result.data.name;
    const desc = `Explore ${name} - Premium 3D printed sculptures, gifts, and decor from MAKERS3D. India's #1 3D printing studio.`;

    return {
      title: name,
      description: desc,
      alternates: { canonical: url },
      openGraph: {
        ...defaultOpenGraph,
        url,
        title: `${name} | MAKERS3D`,
        description: desc,
      },
      twitter: {
        ...defaultTwitter,
        title: `${name} | MAKERS3D`,
        description: desc,
      },
    };
  }

  return {
    title: "Product",
    description: "Premium 3D printed product from MAKERS3D.",
    alternates: { canonical: url },
    openGraph: { ...defaultOpenGraph, url },
    twitter: { ...defaultTwitter },
  };
}

export default function ProductDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
