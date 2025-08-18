import { emailCopy } from './i18n';

export async function sendEmail(
  to: string | string[],
  subject: string,
  html: string,
  text?: string,
  ics?: { filename: string; content: string },
) {
  if (!process.env.NEXT_PUBLIC_ENABLE_EMAILS || !process.env.RESEND_API_KEY) {
    console.info('[notify:dryrun]', { to, subject });
    return;
  }
  // eslint-disable-next-line no-eval, @typescript-eslint/no-implied-eval
  const req = eval('require');
  let ResendCtor: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  try {
    ResendCtor = req('resend').Resend;
  } catch {
    console.info('[notify] resend sdk missing');
    return;
  }
  const resend = new ResendCtor(process.env.RESEND_API_KEY);
  const attachments = ics
    ? [
        {
          filename: ics.filename,
          content: Buffer.from(ics.content).toString('base64'),
          type: 'text/calendar; method=PUBLISH',
        },
      ]
    : undefined;
  await resend.emails.send({
    from: process.env.NOTIFY_FROM || 'QuickGig <noreply@quickgig.ph>',
    to,
    subject,
    html,
    text,
    attachments,
  });
}

function template(str: string, data: Record<string, unknown>): string {
  return str.replace(/{{(\w+)}}/g, (_, k) => String(data[k] ?? ''));
}

export type TemplateName =
  | 'apply:applicant'
  | 'apply:employer'
  | 'interview:proposed'
  | 'interview:accepted'
  | 'interview:declined'
  | 'digest:admin';

export function renderEmail(
  name: TemplateName,
  data: Record<string, unknown>,
  lang: 'en' | 'tl',
) {
  const s = emailCopy[lang];
  let subject = '';
  let body: string[] = [];
  let ics: { filename: string; content: string } | undefined;
  switch (name) {
    case 'apply:applicant': {
      subject = template(s.apply.subject, data);
      body = s.apply.body.map((b) => template(b, data));
      break;
    }
    case 'apply:employer': {
      subject = template(s.apply.employer.subject, data);
      body = s.apply.employer.body.map((b) => template(b, data));
      break;
    }
    case 'interview:proposed': {
      subject = template(s.interview.proposed.subject, data);
      body = s.interview.proposed.body.map((b) => template(b, data));
      break;
    }
    case 'interview:accepted': {
      subject = template(s.interview.accepted.subject, data);
      body = s.interview.accepted.body.map((b) => template(b, data));
      if (data.uid && data.startISO) {
        const content = makeIcs({
          uid: String(data.uid),
          title: String(data.title || ''),
          startISO: String(data.startISO),
          durationMin: Number(data.durationMin || 30),
          location: String(data.location || ''),
          url: String(data.url || ''),
        });
        ics = { filename: 'invite.ics', content };
      }
      break;
    }
    case 'interview:declined': {
      subject = template(s.interview.declined.subject, data);
      body = s.interview.declined.body.map((b) => template(b, data));
      break;
    }
    case 'digest:admin': {
      subject = template(s.admin.digest.subject, data);
      body = s.admin.digest.body.map((b) => template(b, data));
      break;
    }
  }
  const html = body.map((l) => `<p>${l}</p>`).join('');
  const text = body.join('\n');
  return { subject, html, text, ics };
}

export function makeIcs({
  uid,
  title,
  startISO,
  durationMin,
  location,
  url,
}: {
  uid: string;
  title: string;
  startISO: string;
  durationMin: number;
  location?: string;
  url?: string;
}): string {
  const start = new Date(startISO);
  const end = new Date(start.getTime() + durationMin * 60000);
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
  return (
    'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//QuickGig//EN\nBEGIN:VEVENT\n' +
    `UID:${uid}\nDTSTAMP:${fmt(new Date())}\nDTSTART:${fmt(start)}\nDTEND:${fmt(end)}\nSUMMARY:${title}\n` +
    (location ? `LOCATION:${location}\n` : '') +
    (url ? `URL:${url}\n` : '') +
    'END:VEVENT\nEND:VCALENDAR'
  );
}
