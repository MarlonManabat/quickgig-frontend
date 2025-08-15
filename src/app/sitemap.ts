import { env } from '@/config/env';
import { API } from '@/config/api';
import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  interface Job { id: string | number }
  let jobIds: Array<string | number> = [];
  try {
    const res = await fetch(`${env.API_URL}${API.jobs}`);
    const data = await res.json();
    if (Array.isArray(data)) {
      jobIds = (data as Job[]).map((j) => j.id);
    }
  } catch {
    // ignore if API unavailable
  }

  const baseUrl = 'https://quickgig.ph';
  const staticRoutes = ['/', '/jobs', '/login', '/register'];
  return [
    ...staticRoutes,
    ...jobIds.map((id) => `/jobs/${id}`),
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));
}
