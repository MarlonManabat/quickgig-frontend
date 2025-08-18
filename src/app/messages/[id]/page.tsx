"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { MessageList } from '@/components/messages/MessageList';
import { Composer } from '@/components/messages/Composer';
import { usePolling } from '@/hooks/usePolling';
import { Thread } from '@/types/messages';
import { env } from '@/config/env';
import { track } from '@/lib/track';

export default function ThreadPage() {
  const params = useParams<{ id: string }>()!;
  const id = params.id;
  const [thread, setThread] = useState<Thread>({ messages: [] });

  async function load() {
    try {
      const r = await fetch(`/api/msg/${id}`);
      const json = (await r.json().catch(() => ({}))) as Thread;
      setThread(json);
    } catch {
      setThread({ messages: [] });
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    load();
    fetch(`/api/msg/${id}/read`, { method: 'POST' }).catch(() => {});
  }, [id]);

  usePolling(load, 45000);

  async function handleSend(body: string) {
    await fetch(`/api/msg/${id}/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body }),
    }).catch(() => {});
    await load();
    if (env.NEXT_PUBLIC_ENABLE_ANALYTICS)
      track('message_send', { conversationId: id });
  }

  return (
    <div>
      <MessageList messages={thread.messages || []} />
      <Composer onSend={handleSend} />
    </div>
  );
}
