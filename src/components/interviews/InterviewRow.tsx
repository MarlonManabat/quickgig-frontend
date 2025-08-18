'use client';
import InterviewBadge from './InterviewBadge';
import type { Interview } from '@/types/interview';
import { t } from '@/lib/i18n';

export default function InterviewRow({ interview }: { interview: Interview }) {
  return (
    <div className="flex items-center justify-between border-b py-2 text-sm">
      <div>
        <div className="font-medium">
          {new Date(interview.startsAt).toLocaleString()}
        </div>
        {interview.locationOrLink && (
          <div className="text-xs">{interview.locationOrLink}</div>
        )}
      </div>
      <InterviewBadge status={interview.status} />
      <a
        href={`/api/interviews/${interview.id}/invite.ics`}
        className="text-blue-600 hover:underline"
      >
        {t('interviews.addToCalendar')}
      </a>
    </div>
  );
}
