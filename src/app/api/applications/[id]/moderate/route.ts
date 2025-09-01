// Do NOT add "use server" in this file.
// Route handlers may export GET/POST/etc and a few config exports (runtime, dynamic).

import { userIdFromCookie } from '@/lib/supabase/server';
import {
  moderateApplication,
  ForbiddenError,
  NotFoundError,
  BadRequestError,
} from '@/lib/applications/moderation';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Body = { action?: 'approve' | 'reject' };

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const uid = await userIdFromCookie();
  if (!uid) return new Response('Unauthorized', { status: 401 });

  let body: Body = {};
  try {
    body = (await req.json()) as Body;
  } catch {
    /* allow empty body; will fail validation below */
  }

  const action = body.action;
  if (action !== 'approve' && action !== 'reject') {
    return new Response('Invalid action', { status: 400 });
  }

  try {
    const result = await moderateApplication({ id: params.id, action, uid });
    return Response.json(result);
  } catch (err) {
    if (err instanceof ForbiddenError) return new Response(err.message, { status: 403 });
    if (err instanceof NotFoundError) return new Response(err.message, { status: 404 });
    if (err instanceof BadRequestError) return new Response(err.message, { status: 400 });
    console.error('applications/moderate error', err);
    return new Response('Internal Server Error', { status: 500 });
  }
}
