import { NextResponse } from 'next/server';
import { sendMail } from '@/server/mailer';

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as {
      to: string;
      subject: string;
      html: string;
    } | null;
    if (body) {
      await sendMail(body).catch(() => {});
    }
  } catch {
    // ignore
  }
  return NextResponse.json({ ok: true });
}
