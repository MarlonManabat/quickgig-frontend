import { SEO } from '@/config/seo';
export function canonical(path = '') {
  const base = SEO.siteUrl.replace(/\/$/, '');
  const cleaned = ('/' + String(path || '')).replace(/\/+$/, '');
  return `${base}${cleaned === '/' ? '' : cleaned}`;
}
