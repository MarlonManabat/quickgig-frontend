export type NotifyKind = 'message' | 'interview' | 'alert' | 'admin';
export interface NotifyItem {
  id: string;
  kind: NotifyKind;
  title: string;
  body?: string;
  href?: string;
  createdAt: string;
  unread: boolean;
  meta?: Record<string, string | number | boolean>;
}
export interface NotifyCounts {
  total: number;
  message: number;
  interview: number;
  alert: number;
  admin: number;
}
