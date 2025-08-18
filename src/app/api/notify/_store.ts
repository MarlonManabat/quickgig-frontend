import type { NotifyItem, NotifyCounts, NotifyKind } from '@/types/notify';

const g = globalThis as unknown as { __notify_items?: NotifyItem[] };
if (!g.__notify_items) {
  g.__notify_items = [] as NotifyItem[];
}

export function getItems(): NotifyItem[] {
  return g.__notify_items as NotifyItem[];
}

export function setItems(items: NotifyItem[]) {
  g.__notify_items = items;
}

export function addItem(item: NotifyItem) {
  setItems([item, ...getItems()]);
}

export function markRead(id: string) {
  setItems(getItems().map((it) => (it.id === id ? { ...it, unread: false } : it)));
}

export function markAll(kind?: NotifyKind) {
  setItems(
    getItems().map((it) => (kind && it.kind !== kind ? it : { ...it, unread: false }))
  );
}

export function calcCounts(items: NotifyItem[]): NotifyCounts {
  const counts: NotifyCounts = {
    total: 0,
    message: 0,
    interview: 0,
    alert: 0,
    admin: 0,
  };
  items.forEach((it) => {
    if (it.unread) {
      counts.total += 1;
      counts[it.kind] += 1;
    }
  });
  return counts;
}
