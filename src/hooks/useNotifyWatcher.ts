'use client';
import { useEffect } from 'react';
import { env } from '@/config/env';
import type { NotifyItem } from '@/types/notify';
import { useNotifyStore } from '@/app/notify/store';

const srcEnabled = {
  message: env.NEXT_PUBLIC_NOTIFY_SRC_MESSAGES,
  interview: env.NEXT_PUBLIC_NOTIFY_SRC_INTERVIEWS,
  alert: env.NEXT_PUBLIC_NOTIFY_SRC_ALERTS,
  admin: env.NEXT_PUBLIC_NOTIFY_SRC_ADMIN,
};

export function useNotifyWatcher() {
  const { ingest, hydrate } = useNotifyStore();

  useEffect(() => {
    if (!env.NEXT_PUBLIC_ENABLE_NOTIFY_CENTER) return;
    fetch('/api/notify/index')
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d.items)) {
          const items = (d.items as NotifyItem[]).filter((i) => srcEnabled[i.kind]);
          hydrate(items);
        }
      })
      .catch(() => {});
  }, [hydrate]);

  useEffect(() => {
    if (!env.NEXT_PUBLIC_ENABLE_NOTIFY_CENTER) return;
    if (env.NEXT_PUBLIC_ENABLE_SOCKETS) {
      const es = new EventSource('/api/notify/events');
      es.onmessage = (e) => {
        try {
          const item = JSON.parse(e.data) as NotifyItem;
          if (srcEnabled[item.kind]) ingest(item);
        } catch {
          /* ignore */
        }
      };
      es.onerror = () => es.close();
      return () => es.close();
    }
    const id = setInterval(() => {
      fetch('/api/notify/index')
        .then((r) => r.json())
        .then((d) => {
          if (Array.isArray(d.items)) {
            const items = (d.items as NotifyItem[]).filter((i) => srcEnabled[i.kind]);
            hydrate(items);
          }
        })
        .catch(() => {});
    }, env.EVENTS_POLL_MS);
    return () => clearInterval(id);
  }, [ingest, hydrate]);
}
