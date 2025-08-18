export interface ICSOpts {
  uid: string;
  title: string;
  desc?: string;
  start: Date;
  end: Date;
  loc?: string;
  org?: string;
  mailto?: string;
}

function esc(s: string): string {
  return s.replace(/[\\,;]/g, (m) => `\\${m}`).replace(/\n/g, '\\n');
}

function fmt(d: Date): string {
  return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

export function toICS(i: ICSOpts): string {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//QuickGig//Interview//EN',
    'BEGIN:VEVENT',
    `UID:${esc(i.uid)}`,
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${fmt(i.start)}`,
    `DTEND:${fmt(i.end)}`,
    `SUMMARY:${esc(i.title)}`,
  ];
  if (i.desc) lines.push(`DESCRIPTION:${esc(i.desc)}`);
  if (i.loc) lines.push(`LOCATION:${esc(i.loc)}`);
  if (i.org && i.mailto)
    lines.push(`ORGANIZER;CN=${esc(i.org)}:MAILTO:${esc(i.mailto)}`);
  lines.push('END:VEVENT', 'END:VCALENDAR', '');
  return lines.join('\r\n');
}
