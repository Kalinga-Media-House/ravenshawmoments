import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ravenshawmoments.com';

  // We are returning just the static core routes for this milestone.
  // In a full implementation, we would query the database here to return all dynamic slugs.
  const routes = [
    '',
    '/about',
    '/contact',
    '/donations',
    '/departments',
    '/hostels',
    '/organizations',
    '/gallery',
    '/events',
    '/news',
    '/privacy-policy',
    '/terms-of-service',
    '/cookie-policy',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  return routes;
}
