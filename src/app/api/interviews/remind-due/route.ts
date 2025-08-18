import { NextResponse } from 'next/server';
import { listAll } from '@/src/lib/interviews';
import { sendInterviewReminder } from '@/server/mailer';

export async function POST() {
  if (process.env.NEXT_PUBLIC_ENABLE_INTERVIEW_REMINDERS !== 'true') {
    return NextResponse.json({ skipped: true });
  }
  const all = listAll();
  const lead = parseInt(process.env.REMINDER_LEAD_HOURS || '24', 10);
  const now = Date.now();
  for (const iv of all) {
    const start = new Date(
      (iv.startISO || iv.whenISO || iv.startsAt) as string,
    ).getTime();
    if (start - now <= lead * 3600 * 1000 && start > now) {
      if (process.env.NEXT_PUBLIC_ENABLE_EMAILS === 'true') {
        try {
          await sendInterviewReminder({ interview: iv });
        } catch {}
      }
    }
  }
  return NextResponse.json({ ok: true }, { status: 202 });
}
