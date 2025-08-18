'use client';
import { t } from '@/lib/i18n';

const COLORS: Record<string, string> = {
  proposed: 'bg-yellow-200 text-yellow-800',
  accepted: 'bg-green-200 text-green-800',
  declined: 'bg-red-200 text-red-800',
  cancelled: 'bg-gray-200 text-gray-800',
  completed: 'bg-blue-200 text-blue-800',
  rescheduled: 'bg-purple-200 text-purple-800',
};

export default function InterviewBadge({ status }: { status: string }) {
  const cls = COLORS[status] || 'bg-gray-200 text-gray-800';
  return (
    <span className={`px-2 py-1 rounded text-xs ${cls}`}>{t(`interviews.status.${status}`) || status}</span>
  );
}
