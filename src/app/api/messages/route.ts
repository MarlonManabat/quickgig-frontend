import { NextResponse } from 'next/server';
import { listMessages, createMessage } from '@/lib/messages/server';
import { userIdFromCookie } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const applicationId = searchParams.get('applicationId');
  const after = searchParams.get('after') || undefined;
  if (!applicationId) {
    return NextResponse.json({ error: 'applicationId required' }, { status: 400 });
  }
  const msgs = await listMessages({ applicationId, after });
  return NextResponse.json(msgs);
}

export async function POST(req: Request) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  const applicationId = body?.applicationId;
  const text = body?.body;
  if (!applicationId || typeof text !== 'string' || !text.trim()) {
    return NextResponse.json({ error: 'applicationId and body required' }, { status: 400 });
  }
  const uid = (await userIdFromCookie()) ?? 'anon';
  const saved = await createMessage({ applicationId, senderId: uid, body: text });
  if (!saved) {
    return NextResponse.json({ error: 'Unable to save' }, { status: 500 });
  }
  return NextResponse.json(saved, { status: 201 });
}
