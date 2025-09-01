export const dynamic = 'force-dynamic';
const pages = ['/', '/gigs', '/about', '/help', '/terms', '/privacy'];
export function GET() {
  const origin = process.env.NEXT_PUBLIC_APP_ORIGIN ?? 'https://example.com';
  const urls = pages.map(p => `<url><loc>${origin}${p}</loc></url>`).join('');
  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
}
