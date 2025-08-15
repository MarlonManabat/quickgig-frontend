import type { MetadataRoute } from 'next';
import { SEO } from '@/config/seo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (SEO.siteUrl || 'https://quickgig.ph').replace(/[/]$/, '');
  const urls: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/jobs`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/login`, priority: 0.3 },
    { url: `${base}/register`, priority: 0.3 },
  ];

  const apiBase = (process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || '').replace(/[/]$/, '');
  if (!apiBase) return urls;

  try {
    const controller = new AbortController();
    const to = setTimeout(() => controller.abort(), 2500);
    const res = await fetch(`${apiBase}/jobs/list.php?page=1&limit=100`, {
      signal: controller.signal,
      cache: 'no-store',
      next: { revalidate: 60 },
    });
    clearTimeout(to);

      if (res.ok) {
        const raw: unknown = await res.json().catch(() => null);
        const list = Array.isArray(raw)
          ? raw
          : Array.isArray((raw as Record<string, unknown>)?.items)
          ? ((raw as Record<string, unknown>).items as unknown[])
          : Array.isArray((raw as Record<string, unknown>)?.data)
          ? ((raw as Record<string, unknown>).data as unknown[])
          : [];
        for (const it of list.slice(0, 100)) {
          const rec = it as Record<string, unknown>;
          const id = String(rec.id ?? rec.jobId ?? rec.slug ?? '');
          if (!id) continue;
          urls.push({
            url: `${base}/jobs/${encodeURIComponent(id)}`,
            changeFrequency: 'daily',
            priority: 0.8,
          });
        }
      }
  } catch {
    // swallow and use static urls only
  }

  return urls;
}
