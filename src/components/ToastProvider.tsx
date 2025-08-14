'use client';

import { useEffect, useState } from 'react';
import { subscribe } from '@/lib/toast';

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
      <div className="fixed top-4 right-4 space-y-2 z-50">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="bg-red-500 text-white px-4 py-2 rounded shadow"
          >
            {t.message}
          </div>
        ))}
      </div>
    </>
  );
}
