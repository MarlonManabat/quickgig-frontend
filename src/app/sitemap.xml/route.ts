import { getOrigin } from '@/lib/origin';
import { NextResponse } from 'next/server';
import { publicSupabase } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  const origin = getOrigin();
  const supa = await publicSupabase?.() ?? null as any; // tolerate missing secrets
  let entries: { loc: string; lastmod?: string }[] = [];

  if (supa) {
    const { data } = await supa.from('gigs').select('id, updated_at, created_at, published').eq('published', true).limit(200);
    entries = (data ?? []).map((g: any) => ({
      loc: `${origin}/gigs/${g.id}`,
      lastmod: (g.updated_at || g.created_at) ?? undefined
    }));
  } else {
    // minimal fallback
    entries = [{ loc: `${origin}/gigs` }];
  }

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    [`${origin}/`, `${origin}/gigs`, `${origin}/applications`]
      .map(u => `<url><loc>${u}</loc></url>`).join('\n') +
    '\n' +
    entries.map(e => `<url><loc>${e.loc}</loc>${e.lastmod ? `<lastmod>${new Date(e.lastmod).toISOString()}</lastmod>` : ''}</url>`).join('\n') +
    '\n</urlset>';

  return new NextResponse(xml, { headers: { 'content-type': 'application/xml' } });
}
