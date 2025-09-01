import { getOrigin } from '@/lib/origin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Minimal sitemap: add more static routes later as features land
export async function GET() {
  const origin = getOrigin();
  const paths = ['/', '/gigs'];

  const urls = paths
    .map(
      (p) =>
        `<url><loc>${origin}${p}</loc><changefreq>daily</changefreq><priority>0.7</priority></url>`
    )
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;

  return new Response(xml, {
    headers: { 'content-type': 'application/xml' },
  });
}
