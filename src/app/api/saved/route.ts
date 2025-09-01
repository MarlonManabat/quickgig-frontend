// No 'use server' here.
import { userIdFromCookie } from '@/lib/supabase/server';
import { listSaved } from '@/lib/saved/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const uid = await userIdFromCookie();
  if (!uid) return new Response('Unauthorized', { status: 401 });

  const items = await listSaved({ uid });
  return Response.json({ ok: true, items });
}

