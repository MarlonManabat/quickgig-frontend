export const dynamic = 'force-dynamic';
export function GET() {
  const body = [
    'User-agent: *',
    'Allow: /',
    'Sitemap: https://'+process.env.NEXT_PUBLIC_APP_ORIGIN?.replace(/^https?:\/\//,'')+'/sitemap.xml'
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain' } });
}
