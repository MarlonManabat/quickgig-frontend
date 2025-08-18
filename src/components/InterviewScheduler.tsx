'use client';
import { useEffect, useState } from 'react';
import InterviewReminder from './InterviewReminder';
import { t } from '@/lib/i18n';

interface Props { auto?: boolean }
export default function InterviewScheduler({ auto }: Props) {
  const [inviteSent, setInviteSent] = useState(auto || false);
  useEffect(() => {
    if (!auto) setInviteSent(true);
  }, [auto]);
  return (
    <div>
      {inviteSent && <div data-testid="invite-sent">{t('qa.inviteSent')}</div>}
      {inviteSent && <InterviewReminder auto={auto} />}
    </div>
  );
}
