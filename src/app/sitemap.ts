import type { MetadataRoute } from 'next';
import { SEO } from '@/config/seo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = ['/', '/jobs', '/login', '/register'];
  const urls: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${SEO.siteUrl}${route === '/' ? '' : route}`,
    lastModified: new Date(),
  }));
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/list.php?page=1&limit=100`);
    const data = await res.json();
    if (Array.isArray(data)) {
      for (const job of data) {
        if (job?.id) {
          urls.push({ url: `${SEO.siteUrl}/jobs/${job.id}`, lastModified: new Date() });
        }
      }
    }
  } catch {
    // ignore
  }
  return urls;
}
