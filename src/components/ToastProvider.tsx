'use client';

import { useEffect, useState } from 'react';
import { subscribe } from '@/lib/toast';
import { t } from '@/lib/t';

interface Toast {
  id: number;
  message: string;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    return subscribe((message) => {
      const id = Date.now();
      setToasts((ts) => [...ts, { id, message }]);
      setTimeout(() => {
        setToasts((ts) => ts.filter((t) => t.id !== id));
      }, 4000);
    });
  }, []);

  return (
    <>
      {children}
      <div className="fixed top-4 right-4 space-y-2 z-50" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="bg-red-500 text-white px-4 py-2 rounded shadow flex items-center gap-2"
          >
            <span className="flex-1">{t.message}</span>
            <button
              aria-label={t('toast.close')}
              className="text-white focus:outline focus:outline-2"
              onClick={() => setToasts((ts) => ts.filter((x) => x.id !== t.id))}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
