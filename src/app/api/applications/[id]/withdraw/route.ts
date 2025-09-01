export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { userIdFromCookie } from '@/lib/supabase/server';
import {
  withdrawApplication,
  ForbiddenError,
  NotFoundError,
  BadRequestError,
} from '@/lib/applications/store';
export async function POST(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const uid = await userIdFromCookie();
  if (!uid) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const id = params.id;

  try {
    const result = await withdrawApplication({ id, uid });
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof ForbiddenError) {
      return NextResponse.json({ error: 'forbidden' }, { status: 403 });
    }
    if (err instanceof NotFoundError) {
      return NextResponse.json({ error: 'not_found' }, { status: 404 });
    }
    if (err instanceof BadRequestError) {
      return NextResponse.json({ error: 'bad_request' }, { status: 400 });
    }
    return NextResponse.json({ error: 'unexpected' }, { status: 500 });
  }
}
