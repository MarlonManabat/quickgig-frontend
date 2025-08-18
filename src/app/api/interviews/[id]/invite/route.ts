import { NextResponse } from 'next/server';
import { listAll } from '@/src/lib/interviews';
import { sendInterviewInvite } from '@/server/mailer';

export async function POST(_: Request, ctx: { params: { id: string } }) {
  if (process.env.NEXT_PUBLIC_ENABLE_INTERVIEW_INVITES !== 'true') {
    return NextResponse.json({ skipped: true });
  }
  const all = listAll();
  const iv = all.find((i) => i.id === ctx.params.id);
  if (!iv) return NextResponse.json({ ok: false }, { status: 404 });
  if (process.env.NEXT_PUBLIC_ENABLE_EMAILS === 'true') {
    try {
      await sendInterviewInvite({ interview: iv });
    } catch {}
  }
  return NextResponse.json({ ok: true }, { status: 202 });
}
