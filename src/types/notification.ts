export type NotificationKind = 'message' | 'application' | 'interview' | 'alert' | 'admin';

export type NotificationItem = {
  id: string;
  kind: NotificationKind;
  title: string;
  body?: string;
  createdAt: string; // ISO
  read: boolean;
  // deep link targets
  href?: string;
  meta?: Record<string, string | number | boolean | null>;
};
export type NotificationList = {
  items: NotificationItem[];
  total: number;
  unread: number;
};
