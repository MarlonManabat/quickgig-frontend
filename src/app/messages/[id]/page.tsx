'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { usePolling } from '@/lib/usePolling';

interface Msg {
  id: string | number;
  text: string;
  fromMe?: boolean;
  createdAt?: string;
}

interface Meta {
  toEmail?: string;
  toName?: string;
  jobTitle?: string;
  jobId?: string | number;
}

export default function ThreadPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [messages, setMessages] = useState<Msg[]>([]);
  const [meta, setMeta] = useState<Meta>({});
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const liveRef = useRef<HTMLDivElement>(null);

  const load = () => {
    fetch(`/api/msg/${id}`)
      .then((r) => r.json())
      .then((d) => {
        setMessages(d.messages || []);
        setMeta({
          toEmail: d.otherEmail,
          toName: d.otherName,
          jobTitle: d.jobTitle,
          jobId: d.jobId,
        });
      })
      .catch(() => {});
  };

  useEffect(() => {
    load();
    fetch(`/api/msg/${id}/read`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' }).catch(
      () => {},
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  usePolling<{ messages?: Msg[] }>(`/api/msg/${id}`, 7000, (d) => {
    const list = (d.messages || []) as Msg[];
    const diff = list.length - messages.length;
    setMessages(list);
    if (diff > 0 && liveRef.current) {
      liveRef.current.textContent = `${diff} new message${diff > 1 ? 's' : ''}`;
    }
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    if (!text.trim()) return;
    setSending(true);
    await fetch(`/api/msg/${id}/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    })
      .then((r) => r.json())
      .then(() => {
        if (liveRef.current) {
          liveRef.current.textContent = 'Message sent';
        }
        setText('');
        load();
        void fetch('/api/notify/message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            toEmail: meta.toEmail,
            toName: meta.toName,
            jobTitle: meta.jobTitle,
          }),
        }).catch(() => {});
      })
      .catch(() => {})
      .finally(() => setSending(false));
  };

  return (
    <main className="p-4 flex flex-col h-[80vh]">
      <div className="mb-2">
        <Link href="/messages" className="text-qg-accent text-sm">
          &larr; Back
        </Link>
      </div>
      <div className="mb-4 flex justify-between items-center">
        <div className="font-medium">{meta.toName || 'Conversation'}</div>
        {meta.jobId && (
          <Link href={`/jobs/${meta.jobId}`} className="text-sm text-qg-accent underline">
            {meta.jobTitle || 'Job'}
          </Link>
        )}
      </div>
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <p>Say hello to start the conversation.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`max-w-[80%] px-3 py-2 rounded text-sm ${
                  m.fromMe ? 'ml-auto bg-qg-accent text-white' : 'bg-gray-200'
                }`}
              >
                <div>{m.text}</div>
                {m.createdAt && (
                  <div className="text-xs text-gray-500">
                    {new Date(m.createdAt).toLocaleTimeString()}
                  </div>
                )}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>
      <div className="mt-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={1000}
          className="w-full border rounded p-2 mb-2"
          rows={3}
        />
        <Button onClick={send} disabled={sending || !text.trim()}>
          Send
        </Button>
      </div>
      <div aria-live="polite" className="sr-only" ref={liveRef} />
    </main>
  );
}
