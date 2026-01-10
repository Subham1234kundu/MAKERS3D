import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://makers3d.in';

    // In a real app, you would fetch product IDs and generate URLs dynamically
    // but for now we list the main static routes
    const routes = [
        '',
        '/products',
        '/customorder',
        '/login',
        '/signup',
        '/cart',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    return routes;
}
