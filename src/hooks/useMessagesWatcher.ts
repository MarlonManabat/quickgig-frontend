'use client';
import { useEffect, useRef } from 'react';
import { toast } from '@/lib/toast';
import { push, ensurePermission } from '@/lib/notify';
import { connectMessagesEvents } from '@/lib/events';
import type { Message } from '@/types/messages';

export function useMessagesWatcher(enabled: boolean) {
  const last = useRef<number>(0);
  useEffect(() => {
    if (!enabled) return;
    (async () => {
      try { await ensurePermission(); } catch {}
    })();

    type Msg = Message & { preview?: string };
      const handle = (m: Msg) => {
        const ts = Date.parse(m.createdAt);
        if (ts <= last.current) return;
        last.current = ts;
        const url = `/messages/${m.threadId}`;
        window.dispatchEvent(new CustomEvent<Message>('qg-message', { detail: m }));
        const w = window as unknown as { _activeThread?: string };
        if (w._activeThread === m.threadId) return;
        (toast as unknown as { success?: (title: string, opts?: unknown) => void }).success?.('New message', {
          description: m.body || m.preview,
          action: { label: 'Open', onClick() { location.assign(url); } },
        });
        push('New message', m.body || m.preview || '', url);
      };

    if (process.env.NEXT_PUBLIC_ENABLE_SOCKETS === 'true') {
      const { close } = connectMessagesEvents({
        enabled: true,
        onMessage: (d) => handle(d as Msg),
        onError: () => {},
      });
      return () => close();
    }

    const poll = async () => {
      try {
        const r = await fetch('/api/messages?latest=1', { cache: 'no-store' });
        const j = await r.json();
        const ts = j?.latest ? Date.parse(j.latest.createdAt) : 0;
        if (j?.latest && ts > last.current) {
          const r2 = await fetch(`/api/messages/${j.latest.threadId}`);
          const j2 = await r2.json().catch(() => ({}));
          const arr = j2.messages || [];
          const m: Msg = arr[arr.length - 1] || j.latest;
          handle(m);
        }
      } catch {}
    };
    poll();
    const t = setInterval(poll, 20000);
    return () => { clearInterval(t); };
  }, [enabled]);
}
