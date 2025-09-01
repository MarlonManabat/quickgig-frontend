export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { userIdFromCookie } from '@/lib/supabase/server';
import {
  withdrawApplication,
  NotFoundError,
  ForbiddenError,
} from '@/lib/applications/server';

export async function POST(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const uid = await userIdFromCookie();
  if (!uid) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const appId = params?.id;
  if (typeof appId !== 'string' || appId.length === 0) {
    return NextResponse.json({ error: 'invalid_id' }, { status: 400 });
  }

  try {
    await withdrawApplication(uid, appId);
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof NotFoundError) {
      return NextResponse.json(
        { error: 'application_not_found' },
        { status: 404 },
      );
    }
    if (err instanceof ForbiddenError) {
      return NextResponse.json({ error: 'forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'unexpected' }, { status: 500 });
  }
}
