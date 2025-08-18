'use client';
import { useCallback, useEffect, useState } from 'react';
import type { NotificationKind, NotificationList } from '@/types/notification';
import { env } from '@/config/env';
import { usePolling } from './usePolling';
import { unwrapApi } from '@/lib/unwrapApi';

const kinds: NotificationKind[] = ['message', 'application', 'interview', 'alert', 'admin'];

export function useNotifications() {
  const [unreadCounts, setUnread] = useState<Record<NotificationKind | 'all', number>>({
    all: 0,
    message: 0,
    application: 0,
    interview: 0,
    alert: 0,
    admin: 0,
  });

  const refreshCounts = useCallback(async () => {
    const record: Record<NotificationKind | 'all', number> = {
      all: 0,
      message: 0,
      application: 0,
      interview: 0,
      alert: 0,
      admin: 0,
    };
    await Promise.all(
      (['all', ...kinds] as (NotificationKind | 'all')[]).map(async (k) => {
        try {
          const params = new URLSearchParams({ kind: k, page: '1', size: '0' });
          const res = await fetch(`/api/notifications?${params.toString()}`);
          if (res.ok) {
            const data = await unwrapApi<NotificationList>(res);
            record[k] = data.unread;
          }
        } catch {
          /* ignore */
        }
      }),
    );
    setUnread(record);
  }, []);

  useEffect(() => {
    if (!env.NEXT_PUBLIC_ENABLE_NOTIFICATION_CENTER) return;
    refreshCounts();
  }, [refreshCounts]);

  useEffect(() => {
    if (!env.NEXT_PUBLIC_ENABLE_NOTIFICATION_CENTER) return;
    if (!env.NEXT_PUBLIC_ENABLE_SOCKETS) return;
    const es = new EventSource('/api/notifications/events');
    es.addEventListener('notifications:new', () => {
      refreshCounts();
    });
    es.onerror = () => {
      es.close();
    };
    return () => es.close();
  }, [refreshCounts]);

  usePolling(refreshCounts, env.NOTIFS_POLL_MS, {
    enabled: env.NEXT_PUBLIC_ENABLE_NOTIFICATION_CENTER && !env.NEXT_PUBLIC_ENABLE_SOCKETS,
  });

  const list = useCallback(
    async (kind?: NotificationKind, page = 1): Promise<NotificationList> => {
      const params = new URLSearchParams({ page: String(page), size: String(env.NOTIFS_PAGE_SIZE) });
      if (kind) params.set('kind', kind);
      const res = await fetch(`/api/notifications?${params.toString()}`);
      return unwrapApi<NotificationList>(res);
    },
    [],
  );

  const markRead = useCallback(
    async (id: string): Promise<void> => {
      await fetch(`/api/notifications/${id}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ read: true }),
      });
      refreshCounts();
    },
    [refreshCounts],
  );

  const markAllRead = useCallback(
    async (kind?: NotificationKind): Promise<void> => {
      await fetch(`/api/notifications/mark-all-read`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ kind }),
      });
      refreshCounts();
    },
    [refreshCounts],
  );

  return { list, markRead, markAllRead, unreadCounts: unreadCounts };
}
