import { env } from '@/config/env';

type SendArgs = { to: string; subject: string; html: string };

export async function sendMail({ to, subject, html }: SendArgs) {
  if (!env.RESEND_API_KEY) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[notify] RESEND_API_KEY missing, skipping email to', to);
    }
    return { ok: true, skipped: 'email' as const };
  }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.NOTIFY_FROM,
      to,
      subject,
      html,
    }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    console.warn('[notify] email send failed', res.status, text);
    return { ok: false as const, status: res.status, body: text };
  }
  return { ok: true as const };
}
