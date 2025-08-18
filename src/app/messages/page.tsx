"use client";
import { useEffect, useState } from 'react';
import { InboxItem } from '@/components/messages/InboxItem';
import { usePolling } from '@/hooks/usePolling';
import { useRouter } from 'next/navigation';
import { Conversation } from '@/types/messages';

export default function InboxPage() {
  const [items, setItems] = useState<Conversation[]>([]);
  const router = useRouter();

  async function load() {
    try {
      const r = await fetch('/api/msg/list');
      const json = (await r.json().catch(() => ({}))) as { items?: Conversation[] };
      setItems(Array.isArray(json.items) ? json.items : []);
    } catch {
      setItems([]);
    }
  }

  useEffect(() => { load(); }, []);
  usePolling(load, 45000);

  return (
    <div>
      {items.map(c => (
        <InboxItem key={c.id} convo={c} onSelect={() => router.push(`/messages/${c.id}`)} />
      ))}
    </div>
  );
}
