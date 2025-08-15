import type { MetadataRoute } from 'next';
import { SEO } from '@/config/seo';

export default function robots(): MetadataRoute.Robots {
  const host = (SEO.siteUrl || 'https://quickgig.ph').replace(/[/]$/, '');
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `${host}/sitemap.xml`,
    host,
  };
}
