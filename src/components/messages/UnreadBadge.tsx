'use client';
import { useEffect, useState } from 'react';
import { usePolling } from '@/hooks/usePolling';
import { Conversation } from '@/types/messages';

export const UnreadBadge = () => {
  const [count, setCount] = useState(0);

  async function load() {
    try {
      const r = await fetch('/api/msg/list');
      const json = (await r.json().catch(() => ({}))) as { items?: Conversation[] };
      const items = Array.isArray(json.items) ? json.items : [];
      const c = items.filter(i => i.unread).length;
      setCount(c);
    } catch {
      setCount(0);
    }
  }

  useEffect(() => { load(); }, []);
  usePolling(load, 60000);

  return <span>{count}</span>;
};
