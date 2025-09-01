'use server';

import { NextResponse } from 'next/server';
import { userIdFromCookie } from '@/lib/supabase/server';
import { listSaved } from '@/lib/saved/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const uid = await userIdFromCookie();
  if (!uid) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const ids = await listSaved(uid);
  return NextResponse.json({ ids });
}
