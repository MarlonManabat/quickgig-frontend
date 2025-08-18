import { NextResponse } from 'next/server';
import { verify } from '@/lib/signer';
import { update } from '@/src/lib/interviews';

export async function GET(req: Request, ctx: { params: { id: string } }) {
  const url = new URL(req.url);
  const token = url.searchParams.get('token') || '';
  const action = url.searchParams.get('action') || '';
  const payload = verify(token);
  const id = ctx.params.id;
  if (!payload || payload.id !== id || payload.action !== action) {
    return NextResponse.redirect(`/interviews/${id}/rsvp?result=invalid`);
  }
  let status: 'accepted' | 'declined' = 'declined';
  if (action === 'accept') status = 'accepted';
  try {
    await update(id, { status });
  } catch {}
  return NextResponse.redirect(`/interviews/${id}/rsvp?result=${status}`);
}
