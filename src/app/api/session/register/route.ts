import { NextRequest } from 'next/server';
import { env } from '@/config/env';
import { proxyPhp } from '@/lib/proxyPhp';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function OPTIONS() { return new Response(null, { status: 204 }); }
export async function POST(req: NextRequest) {
  if (!env.API_URL) {
    return Response.json(
      { ok: false, error: 'misconfigured', detail: 'API_URL is not set' },
      { status: 503 }
    );
  }
  return proxyPhp(req, '/register.php');
}
