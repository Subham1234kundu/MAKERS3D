import type { Metadata } from 'next';

export const SITE_URL = "https://makers3d.in";
export const SITE_NAME = 'MAKERS3D';
export const BRAND_ALIASES = ['Makers 3D', 'Makers3D'];
export const SOCIAL_IMAGE = '/images/landing/redesign/social-preview.png';
export const HOME_TITLE = 'MAKERS3D | 3D Printing Services & Products in India';
export const HOME_DESCRIPTION = 'Explore MAKERS3D for custom 3D printing, scale models, CAD design and prototypes in India. Shop 3D printed decor, figurines, lamps and gifts.';

export const defaultOpenGraph = {
  type: "website" as const,
  locale: "en_IN" as const,
  siteName: "MAKERS3D",
  images: [
    {
      url: SOCIAL_IMAGE,
      width: 1200,
      height: 630,
      alt: "MAKERS3D — 3D printing services and products",
    },
  ],
};

export const defaultTwitter = {
  card: "summary_large_image" as const,
  images: [SOCIAL_IMAGE],
};

/** Keep search and sharing descriptions aligned with each page's content. */
export function pageMetadata({ title, description, path, image, imageAlt }: {
  title: string;
  description: string;
  path: string;
  image?: string;
  imageAlt?: string;
}): Metadata {
  const url = new URL(path, SITE_URL).href;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      ...defaultOpenGraph,
      url,
      title,
      description,
      ...(image ? { images: [{ url: image, alt: imageAlt || title }] } : {}),
    },
    twitter: { ...defaultTwitter, title, description, ...(image ? { images: [image] } : {}) },
  };
}

export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export function breadcrumbs(items: { name: string; path: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: new URL(item.path, SITE_URL).href,
    })),
  };
}
