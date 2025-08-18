type MailPayload = {
  kind: 'apply' | 'interview' | 'digest';
  to: string;
  from: string;
  subject?: string;
  ics?: string | null;
  data?: Record<string, unknown>;
};

export async function sendMail(msg: MailPayload) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { ok: true, skipped: 'no_api_key' };

  const subject =
    msg.subject ??
    (msg.kind === 'apply'
      ? 'New Job Application'
      : msg.kind === 'interview'
      ? 'Interview Update'
      : 'Daily QuickGig Digest');

  // Minimal Resend call; keep optional and fail-soft.
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      from: msg.from,
      to: [msg.to],
      subject,
      text:
        msg.kind === 'digest'
          ? 'See today’s summary in your admin dashboard.'
          : 'You have a new update in QuickGig.',
      // Keep simple for now; templates can come later
    }),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`Resend error: ${res.status} ${txt}`);
  }
  return { ok: true };
}

