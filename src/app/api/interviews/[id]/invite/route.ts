import { NextResponse } from 'next/server';
import { listAll } from '@/src/lib/interviews';
import { sendInterviewInvite } from '@/server/mailer';
import { flags } from '@/lib/flags';

export async function POST(_: Request, ctx: { params: { id: string } }) {
  if (!flags.interviewInvites) {
    return NextResponse.json({ skipped: true });
  }
  const all = listAll();
  const iv = all.find((i) => i.id === ctx.params.id);
  if (!iv) return NextResponse.json({ ok: false }, { status: 404 });
  if (flags.emails) {
    try {
      await sendInterviewInvite({ interview: iv });
    } catch {}
  }
  return NextResponse.json({ ok: true }, { status: 202 });
}
