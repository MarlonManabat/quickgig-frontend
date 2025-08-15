import { SEO } from '@/config/seo';

export function canonical(path = '') {
  const base = (SEO.siteUrl || 'https://quickgig.ph').replace(/[/]$/, '');
  const cleaned = ('/' + (path || '')).replace(/[/]+$/, '');
  return `${base}${cleaned === '/' ? '' : cleaned}`;
}
