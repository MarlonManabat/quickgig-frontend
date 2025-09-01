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
    body = await req.json();
  } catch {
    /* keep default empty body */
  }

  const action = body.action;
  if (action !== 'approve' && action !== 'reject') {
    return new Response('Invalid action', { status: 400 });
  }

  try {
    const result = await moderateApplication({ id: params.id, action, by: uid });
    return Response.json(result);
  } catch (e) {
    if (e instanceof ForbiddenError) return new Response('Forbidden', { status: 403 });
    if (e instanceof NotFoundError) return new Response('Not Found', { status: 404 });
    if (e instanceof BadRequestError) return new Response(e.message, { status: 400 });
    console.error(e);
    return new Response('Internal Server Error', { status: 500 });
  }
}
