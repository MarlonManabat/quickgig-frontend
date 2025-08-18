'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Bell } from 'lucide-react';
import { env } from '@/config/env';
import { t } from '@/lib/i18n';
import { useNotifyStore } from '@/app/notify/store';
import { useNotifyWatcher } from '@/hooks/useNotifyWatcher';
import { useSettings } from '@/hooks/useSettings';

export default function NotifyBell() {
  const { settings } = useSettings();
  useNotifyWatcher();
  const { counts, items, markRead } = useNotifyStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (!env.NEXT_PUBLIC_ENABLE_NOTIFY_CENTER) return null;
  if (settings && !settings.notifyEnabled) return null;
  const count = counts.total;
  return (
    <div className="relative" ref={ref}>
      <button
        aria-label={count ? `${count} unread notifications` : 'Notifications'}
        onClick={() => setOpen((o) => !o)}
        className="relative p-2 text-gray-700 hover:text-blue-600"
      >
        <Bell className="h-6 w-6" />
        {count > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {count > 99 ? '99+' : count}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white border rounded shadow-lg z-50">
          <div className="p-2 border-b flex justify-between items-center">
            <span className="font-semibold text-sm">{t('notify.heading')}</span>
            <Link
              href="/notifications"
              className="text-blue-600 text-xs hover:underline"
              onClick={() => setOpen(false)}
            >
              {t('notify.openAll')}
            </Link>
          </div>
          <ul data-testid="notify-list" className="max-h-80 overflow-y-auto">
            {items.length === 0 && (
              <li className="p-4 text-sm text-center">{t('notify.empty.all')}</li>
            )}
            {items.map((item) => (
              <li
                key={item.id}
                className="p-2 text-sm flex justify-between items-start gap-2 hover:bg-gray-50"
              >
                <a
                  href={item.href || '#'}
                  className="flex-1"
                  onClick={() => setOpen(false)}
                >
                  {item.title}
                </a>
                {item.unread && (
                  <button
                    onClick={() => markRead(item.id)}
                    className="text-xs text-blue-600"
                  >
                    {t('notify.markRead')}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
