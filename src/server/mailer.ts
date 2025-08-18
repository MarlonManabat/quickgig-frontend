import type { Interview } from '@/types/interview';
import { toICS } from '@/lib/ics';
import { sign } from '@/lib/signer';
import type { UserSettings } from '@/types/settings';
import { defaultsFromEnv } from '@/lib/settings';
import { flags } from '@/lib/flags';

export function shouldSendEmail(
  kind: 'apply' | 'interview' | 'digest',
  s?: UserSettings,
): boolean {
  const st = s || defaultsFromEnv();
  if (st.email === 'none') return false;
  if (st.email === 'ops_only' && kind === 'digest') return false;
  return true;
}

type MailPayload = {
  kind: 'apply' | 'interview' | 'digest';
  to: string;
  from: string;
  subject?: string;
  ics?: string | null;
  data?: Record<string, unknown>;
};

export async function sendMail(msg: MailPayload, settings?: UserSettings) {
  if (!shouldSendEmail(msg.kind, settings)) {
    return { ok: true, skipped: 'prefs' } as const;
  }
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

const emailsEnabled = () => flags.emails;

export async function sendInterviewInvite({
  interview,
  toApplicant,
  toEmployer,
}: {
  interview: Interview;
  toApplicant?: string;
  toEmployer?: string;
}) {
  if (!flags.interviewInvites)
    return { ok: true, skipped: 'flag_off' };
  if (!emailsEnabled()) return { ok: true, skipped: 'emails_off' };
  const from = process.env.INVITES_FROM || process.env.NOTIFY_FROM || '';
  const replyTo = process.env.INVITES_REPLY_TO || '';
  const start = new Date(
    interview.startISO || interview.whenISO || interview.startsAt || ''
  );
  const end = new Date(start.getTime() + (interview.durationMins || 0) * 60000);
  const ics = toICS({
    uid: interview.id,
    title: 'QuickGig Interview',
    start,
    end,
    loc: interview.place,
    org: 'QuickGig',
    mailto: replyTo,
  });
  const base = process.env.NEXT_PUBLIC_APP_URL || '';
  const exp = Math.floor(Date.now() / 1000) + 7 * 86400;
  const accept = sign({ id: interview.id, action: 'accept', exp });
  const decline = sign({ id: interview.id, action: 'decline', exp });
  const body = `Respond:\n${base}/api/interviews/${interview.id}/rsvp?token=${accept}&action=accept\n${base}/api/interviews/${interview.id}/rsvp?token=${decline}&action=decline`;
  const send = (to?: string) =>
    to
      ? sendMail({
          kind: 'interview',
          to,
          from,
          subject: 'Interview Invite',
          ics,
          data: { body, replyTo },
        })
      : Promise.resolve({ ok: true });
  await Promise.all([send(toApplicant), send(toEmployer)]);
  return { ok: true };
}

export async function sendInterviewReminder({
  interview,
  toApplicant,
  toEmployer,
}: {
  interview: Interview;
  toApplicant?: string;
  toEmployer?: string;
}) {
  if (!flags.interviewReminders)
    return { ok: true, skipped: 'flag_off' };
  if (!emailsEnabled()) return { ok: true, skipped: 'emails_off' };
  const from = process.env.INVITES_FROM || process.env.NOTIFY_FROM || '';
  const start = new Date(
    interview.startISO || interview.whenISO || interview.startsAt || ''
  );
  const end = new Date(start.getTime() + (interview.durationMins || 0) * 60000);
  const ics = toICS({
    uid: interview.id,
    title: 'Interview Reminder',
    start,
    end,
    loc: interview.place,
    org: 'QuickGig',
  });
  const body = 'Reminder: upcoming interview.';
  const send = (to?: string) =>
    to
      ? sendMail({
          kind: 'interview',
          to,
          from,
          subject: 'Interview Reminder',
          ics,
          data: { body },
        })
      : Promise.resolve({ ok: true });
  await Promise.all([send(toApplicant), send(toEmployer)]);
  return { ok: true };
}
