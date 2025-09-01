// No 'use server' here.
import { userIdFromCookie } from '@/lib/supabase/server';
import { saveGig, unsaveGig } from '@/lib/saved/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Body = { saved?: boolean }; // saved=true -> save; false -> unsave

export async function PUT(req: Request, { params }: { params: { gigId: string } }) {
  const uid = await userIdFromCookie();
  if (!uid) return new Response('Unauthorized', { status: 401 });

  const { saved }: Body = await req.json().catch(() => ({} as Body));
  if (typeof saved !== 'boolean') return new Response('Missing saved flag', { status: 400 });

  if (saved) {
    await saveGig({ uid, gigId: params.gigId });
  } else {
    await unsaveGig({ uid, gigId: params.gigId });
  }

  return Response.json({ ok: true });
}

