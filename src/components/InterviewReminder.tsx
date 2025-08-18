'use client';
import { useEffect, useState } from 'react';
import { t } from '@/lib/i18n';

interface Props { auto?: boolean }
export default function InterviewReminder({ auto }: Props) {
  const [sent, setSent] = useState(auto || false);
  useEffect(() => {
    if (auto) return;
    const id = setTimeout(() => setSent(true), 60 * 60 * 1000);
    return () => clearTimeout(id);
  }, [auto]);
  if (!sent) return null;
  return <div data-testid="reminder-sent">{t('qa.reminderSent')}</div>;
}
