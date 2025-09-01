'use server';

import { NextResponse } from 'next/server';
import { userIdFromCookie } from '@/lib/supabase/server';
import { saveGig, unsaveGig } from '@/lib/saved/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PUT(_req: Request, { params }: { params: { gigId: string } }) {
  const uid = await userIdFromCookie();
  if (!uid) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const gigId = params?.gigId?.trim();
  if (!gigId) return NextResponse.json({ error: 'invalid_gig' }, { status: 400 });

  await saveGig(uid, gigId);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: { gigId: string } }) {
  const uid = await userIdFromCookie();
  if (!uid) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const gigId = params?.gigId?.trim();
  if (!gigId) return NextResponse.json({ error: 'invalid_gig' }, { status: 400 });

  await unsaveGig(uid, gigId);
  return NextResponse.json({ ok: true });
}
