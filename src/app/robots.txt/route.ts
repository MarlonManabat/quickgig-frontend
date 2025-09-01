import { getOrigin } from '@/lib/origin';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export async function GET() {
  const origin = getOrigin();
  const body = `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`;
  return new Response(body, { headers: { 'content-type': 'text/plain' } });
}
