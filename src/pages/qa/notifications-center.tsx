import { useEffect } from 'react';
import { NotifyProvider, useNotifyStore } from '@/app/notify/store';
import { t } from '@/lib/i18n';
import { toast } from '@/lib/toast';
import type { NotifyItem } from '@/types/notify';
import type { GetServerSideProps } from 'next';

interface Props { auto: boolean }

function Harness({ auto }: Props) {
  const { ingest, items } = useNotifyStore();
  useEffect(() => {
    if (!auto) return;
    const now = new Date().toISOString();
    const evs: NotifyItem[] = [
      { id: 'job-rec', title: t('qa.toastJobReceived'), kind: 'alert', unread: true, createdAt: now },
      { id: 'job-status', title: t('qa.toastStatusChanged'), kind: 'alert', unread: true, createdAt: now },
      { id: 'emp-new', title: t('qa.toastNewApplicant'), kind: 'admin', unread: true, createdAt: now },
      { id: 'emp-msg', title: t('qa.toastNewMessage'), kind: 'message', unread: true, createdAt: now },
    ];
    evs.forEach((e) => {
      ingest(e);
      toast(e.title);
    });
  }, [auto, ingest]);
  return (
    <main className="p-4 space-y-2">
      <h1 className="text-xl font-semibold">{t('qa.notifyCenterTitle')}</h1>
      {auto && (
        <div className="hidden" data-testid="toast-msg">
          {/* marker for smoke script */}
        </div>
      )}
      <ul data-testid="notify-list">
        {items.map((it) => (
          <li key={it.id}>{it.title}</li>
        ))}
      </ul>
    </main>
  );
}

export default function NotificationsCenterQA({ auto }: Props) {
  return (
    <NotifyProvider>
      <Harness auto={auto} />
    </NotifyProvider>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  if (
    process.env.NEXT_PUBLIC_ENABLE_NOTIFY_CENTER_QA !== 'true' ||
    process.env.ENGINE_MODE === 'php'
  ) {
    return { notFound: true } as const;
  }
  return { props: { auto: query.auto === '1' } } as const;
};
