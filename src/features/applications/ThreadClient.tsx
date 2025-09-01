'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import toast from '@/utils/toast';

type Message = { id: string; body: string; created_at: string; sender_id: string };
type Initial = { app: any; msgs: Message[] };

export default function ThreadClient({ applicationId, initial }: { applicationId: string; initial: Initial }) {
  const [msgs, setMsgs] = useState<Message[]>(initial.msgs ?? []);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [body, setBody] = useState('');
  const lastId = useMemo(() => (msgs.length ? msgs[msgs.length - 1].id : undefined), [msgs]);
  const abortRef = useRef<AbortController | null>(null);

  // Poll every 10s (lightweight)
  useEffect(() => {
    let mounted = true;
    const tick = async () => {
      abortRef.current?.abort();
      const ac = new AbortController();
      abortRef.current = ac;
      try {
        const url = lastId ? `/api/messages?applicationId=${applicationId}&after=${lastId}` : `/api/messages?applicationId=${applicationId}`;
        const r = await fetch(url, { signal: ac.signal, cache: 'no-store' });
        if (!r.ok) throw new Error('refresh failed');
        const more: Message[] = await r.json();
        if (!mounted) return;
        if (more.length) setMsgs(prev => [...prev, ...more]);
      } catch (e) {
        // swallow network blips; surface only once
      }
    };
    const id = setInterval(tick, 10_000);
    return () => { mounted = false; clearInterval(id); abortRef.current?.abort(); };
  }, [applicationId, lastId]);

  // Mark as read on mount
  useEffect(() => {
    fetch('/api/messages/read', { method: 'POST', body: JSON.stringify({ applicationId }), headers: { 'Content-Type': 'application/json' } }).catch(() => {});
  }, [applicationId]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim() || pending) return;
    setPending(true);
    const optimistic: Message = { id: `tmp-${Date.now()}`, body, created_at: new Date().toISOString(), sender_id: 'me' };
    setMsgs(prev => [...prev, optimistic]);
    setBody('');
    try {
      const r = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId, body: optimistic.body }),
      });
      if (!r.ok) throw new Error('send failed');
      const saved: Message = await r.json();
      // swap tmp with saved
      setMsgs(prev => prev.map(m => (m.id === optimistic.id ? saved : m)));
    } catch (err) {
      // rollback tmp
      setMsgs(prev => prev.filter(m => m.id !== optimistic.id));
      setBody(optimistic.body);
      toast.error('Failed to send. Check connection and try again.');
      setError('send');
    } finally {
      setPending(false);
    }
  }

  // UI states
  if (!msgs) return <div className="p-4">Loading…</div>;
  if (error && !msgs.length) return <div className="p-4">Couldn’t load messages. <button onClick={() => location.reload()}>Retry</button></div>;
  if (!msgs.length) return <div className="p-4">No messages yet.</div>;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-2 p-4">
        {msgs.map(m => (
          <div key={m.id} className="rounded-lg border p-2" data-testid="message-item">
            <div className="text-xs opacity-60">{new Date(m.created_at).toLocaleString()}</div>
            <div>{m.body}</div>
          </div>
        ))}
      </div>
      <form onSubmit={send} className="border-t p-3 flex gap-2">
        <input className="flex-1 border rounded-lg p-2" value={body} onChange={e => setBody(e.target.value)} placeholder="Type a message…" />
        <button className="border rounded-xl px-3 py-2" disabled={pending || !body.trim()} type="submit">Send</button>
      </form>
    </div>
  );
}
