import { getServerSupabase } from '@/lib/supabase-server';
import { ROUTES } from '@/app/lib/routes';
import { getOrigin } from '@/lib/origin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = getServerSupabase();
  const { data: jobs } = await supabase
    .from('jobs')
    .select('id, updated_at')
    .eq('status', 'published')
    .order('updated_at', { ascending: false })
    .limit(50);

  const origin = getOrigin();
  const routes = [
    ROUTES.HOME,
    ROUTES.BROWSE_JOBS,
    ROUTES.POST_JOB,
    ROUTES.APPLICATIONS,
    ROUTES.TICKETS,
  ];

  const staticUrls = routes
    .map(p => `<url><loc>${origin}${p}</loc></url>`)
    .join('');

  const jobUrls = (jobs || [])
    .map(j =>
      `<url><loc>${origin}/jobs/${j.id}</loc><lastmod>${new Date(j.updated_at).toISOString()}</lastmod></url>`
    )
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${staticUrls}${jobUrls}</urlset>`;

  return new Response(xml, {
    headers: { 'content-type': 'application/xml' },
  });
}
