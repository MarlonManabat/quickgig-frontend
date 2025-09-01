// NOTE: Do not add 'use server' in route files.
// Config exports are allowed when the file is NOT a 'use server' module.
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
  try {
    const uid = await userIdFromCookie();
    if (!uid) return new Response('Unauthorized', { status: 401 });

    const { action }: Body = await req.json().catch(() => ({} as Body));
    if (action !== 'approve' && action !== 'reject') {
      return new Response('Invalid action', { status: 400 });
    }

    const data = await moderateApplication({ id: params.id, action, uid });
    return Response.json({ ok: true, data });
  } catch (err) {
    if (err instanceof ForbiddenError) return new Response(err.message, { status: 403 });
    if (err instanceof NotFoundError) return new Response(err.message, { status: 404 });
    if (err instanceof BadRequestError) return new Response(err.message, { status: 400 });
    console.error('applications/moderate error', err);
    return new Response('Internal error', { status: 500 });
  }
}

