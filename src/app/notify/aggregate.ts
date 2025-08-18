import type { NotifyItem } from '@/types/notify';

export function fromMessage(ev: Record<string, unknown>): NotifyItem {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const e = ev as any;
  return {
    id: e.id || `msg-${Date.now()}`,
    kind: 'message',
    title: e.title || e.sender || 'New message',
    body: e.body,
    href: e.href,
    createdAt: e.createdAt || new Date().toISOString(),
    unread: true,
  };
}

export function fromInterview(ev: Record<string, unknown>): NotifyItem {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const e = ev as any;
  return {
    id: e.id || `int-${Date.now()}`,
    kind: 'interview',
    title: e.title || e.status || 'Interview update',
    body: e.body,
    href: e.href,
    createdAt: e.createdAt || new Date().toISOString(),
    unread: true,
  };
}

export function fromAlert(ev: Record<string, unknown>): NotifyItem {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const e = ev as any;
  return {
    id: e.id || `alt-${Date.now()}`,
    kind: 'alert',
    title: e.title || 'Job alert',
    body: e.body,
    href: e.href,
    createdAt: e.createdAt || new Date().toISOString(),
    unread: true,
  };
}

export function fromAdmin(ev: Record<string, unknown>): NotifyItem {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const e = ev as any;
  return {
    id: e.id || `adm-${Date.now()}`,
    kind: 'admin',
    title: e.title || 'Admin update',
    body: e.body,
    href: e.href,
    createdAt: e.createdAt || new Date().toISOString(),
    unread: true,
  };
}
