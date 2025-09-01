'use server';

import { NextResponse } from 'next/server';
import { userIdFromCookie } from '@/lib/supabase/server';
import { moderateApplication, ForbiddenError, NotFoundError, BadRequestError } from '@/lib/applications/moderation';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Body = { action?: 'approve' | 'reject' };

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const uid = await userIdFromCookie();
    if (!uid) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    const id = params?.id?.trim();
    if (!id) {
      return NextResponse.json({ error: 'invalid_id' }, { status: 400 });
    }

    let body: Body;
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    const action = body?.action;
    if (action !== 'approve' && action !== 'reject') {
      return NextResponse.json({ error: 'invalid_action' }, { status: 400 });
    }

    await moderateApplication(uid, id, action);
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof ForbiddenError) {
      return NextResponse.json({ error: 'forbidden' }, { status: 403 });
    }
    if (err instanceof NotFoundError) {
      return NextResponse.json({ error: 'application_not_found' }, { status: 404 });
    }
    if (err instanceof BadRequestError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error('[applications/moderate] unexpected', err);
    return NextResponse.json({ error: 'unexpected' }, { status: 500 });
  }
}

