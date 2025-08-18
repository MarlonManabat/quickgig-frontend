'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { env } from '@/config/env';
import type { NotifyCounts, NotifyItem, NotifyKind } from '@/types/notify';

const initialCounts: NotifyCounts = { total: 0, message: 0, interview: 0, alert: 0, admin: 0 };

interface NotifyStore {
  items: NotifyItem[];
  counts: NotifyCounts;
  ingest: (item: NotifyItem) => void;
  markRead: (id: string) => void;
  markAll: (kind?: NotifyKind) => void;
  hydrate: (items: NotifyItem[]) => void;
}

const NotifyContext = createContext<NotifyStore | undefined>(undefined);

function calcCounts(items: NotifyItem[]): NotifyCounts {
  const counts: NotifyCounts = { ...initialCounts };
  items.forEach((it) => {
    if (it.unread) {
      counts.total += 1;
      counts[it.kind] += 1;
    }
  });
  return counts;
}

export function NotifyProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<NotifyItem[]>([]);
  const [counts, setCounts] = useState<NotifyCounts>(initialCounts);

  const hydrate = (next: NotifyItem[]) => {
    setItems(next);
    setCounts(calcCounts(next));
  };

  const ingest = (item: NotifyItem) => {
    setItems((prev) => {
      const next = [item, ...prev];
      setCounts(calcCounts(next));
      return next;
    });
  };

  const markRead = (id: string) => {
    setItems((prev) => {
      const next = prev.map((it) => (it.id === id ? { ...it, unread: false } : it));
      setCounts(calcCounts(next));
      return next;
    });
  };

  const markAll = (kind?: NotifyKind) => {
    setItems((prev) => {
      const next = prev.map((it) => (kind && it.kind !== kind ? it : { ...it, unread: false }));
      setCounts(calcCounts(next));
      return next;
    });
  };

  useEffect(() => {
    if (!env.NEXT_PUBLIC_ENABLE_NOTIFY_CENTER) return;
    fetch('/api/notify/index')
      .then((r) => r.json())
      .then((d) => Array.isArray(d.items) && hydrate(d.items))
      .catch(() => {});
  }, []);

  return (
    <NotifyContext.Provider value={{ items, counts, ingest, markRead, markAll, hydrate }}>
      {children}
    </NotifyContext.Provider>
  );
}

export function useNotifyStore() {
  const ctx = useContext(NotifyContext);
  if (!ctx) throw new Error('useNotifyStore must be used within NotifyProvider');
  return ctx;
}

export { calcCounts };
