import { useEffect, useState } from 'react';
import type { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import HeadSEO from '@/components/HeadSEO';
import { useNotifications } from '@/hooks/useNotifications';
import type { NotificationKind, NotificationList } from '@/types/notification';
import Pagination from '@/components/Pagination';
import { env } from '@/config/env';
import { t } from '@/lib/i18n';

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  if (!env.NEXT_PUBLIC_ENABLE_NOTIFICATION_CENTER) return { notFound: true } as const;
  try {
    const base =
      process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
    const res = await fetch(`${base}/api/session/me`, {
      headers: { cookie: req.headers.cookie || '' },
    });
    if (!res.ok) {
      return {
        redirect: { destination: `/login?return=/notifications`, permanent: false },
      } as const;
    }
  } catch {
    return {
      redirect: { destination: `/login?return=/notifications`, permanent: false },
    } as const;
  }
  return { props: {} } as const;
};

const tabs: (NotificationKind | 'all')[] = [
  'all',
  'message',
  'application',
  'interview',
  'alert',
  'admin',
];

export default function NotificationsPage() {
  const router = useRouter();
  const { list, markRead, markAllRead, unreadCounts } = useNotifications();
  const kindParam = (router.query.kind as NotificationKind | undefined) || 'all';
  const page = parseInt((router.query.page as string) || '1', 10);
  const [data, setData] = useState<NotificationList>({ items: [], total: 0, unread: 0 });

  useEffect(() => {
    list(kindParam === 'all' ? undefined : kindParam, page)
      .then(setData)
      .catch(() => {});
  }, [kindParam, page, list]);

  const changeKind = (k: NotificationKind | 'all') => {
    router.push({ pathname: '/notifications', query: { kind: k === 'all' ? undefined : k, page: 1 } });
  };
  const changePage = (p: number) => {
    router.push({ pathname: '/notifications', query: { kind: kindParam === 'all' ? undefined : kindParam, page: p } });
  };

  return (
    <>
      <HeadSEO title={`${t('notifications.title')} • QuickGig`} />
      <main className="qg-container py-8 space-y-4">
        <h1 className="text-2xl font-bold">{t('notifications.title')}</h1>
        <div className="flex gap-2 border-b">
          {tabs.map((k) => (
            <button
              key={k}
              onClick={() => changeKind(k)}
              className={`px-3 py-2 text-sm ${kindParam === k ? 'border-b-2 border-blue-600' : ''}`}
            >
              {t(`notifications.tabs.${k}`)}
              {unreadCounts[k] ? ` (${unreadCounts[k]})` : ''}
            </button>
          ))}
        </div>
        {data.items.length === 0 ? (
          <div className="py-8 text-center">{t(`notifications.empty.${kindParam}`)}</div>
        ) : (
          <ul className="space-y-2">
            {data.items.map((n) => (
              <li key={n.id} className="border p-2 rounded" aria-label={n.title}>
                <article>
                  <div className="flex justify-between items-start">
                    <a href={n.href || '#'} className={n.read ? '' : 'font-semibold'}>
                      {n.title}
                    </a>
                    {!n.read && (
                      <button
                        onClick={() => markRead(n.id)}
                        className="text-xs text-blue-600"
                      >
                        {t('notifications.markRead')}
                      </button>
                    )}
                  </div>
                  <time dateTime={n.createdAt} className="block text-xs text-gray-500">
                    {new Date(n.createdAt).toLocaleString()}
                  </time>
                </article>
              </li>
            ))}
          </ul>
        )}
        <div className="flex justify-end">
          <button
            onClick={() =>
              markAllRead(kindParam === 'all' ? undefined : (kindParam as NotificationKind))
            }
            className="text-sm text-blue-600"
          >
            {t('notifications.markAllRead')}
          </button>
        </div>
        <Pagination
          page={page}
          total={data.total}
          pageSize={env.NOTIFS_PAGE_SIZE}
          onPageChange={changePage}
        />
      </main>
    </>
  );
}
