import * as React from 'react';
import { useRouter } from 'next/router';
import ProductShell from '@/components/layout/ProductShell';
import { HeadSEO } from '@/components/HeadSEO';
import MessageBubble from '@/product/messages/MessageBubble';
import { requireAuthSSR } from '@/lib/auth';
import { t } from '@/lib/t';
import { useThread } from '@/hooks/useMessages';
import type { Thread } from '@/types/messages';
import type { Session } from '@/types/user';
import { env } from '@/config/env';
import type { GetServerSidePropsContext } from 'next';

interface Props { thread: Thread | null; session: Session }

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  if (!env.NEXT_PUBLIC_ENABLE_MESSAGES) return { notFound: true };
  return requireAuthSSR([], async ({ req, params }) => {
    const base = process.env.BASE_URL || `http://${req.headers.host}`;
    const id = String(params?.id || '');
    if (id && id !== 'new') {
      try {
        const r = await fetch(`${base}/api/messages`, { headers: { cookie: req.headers.cookie || '' } });
        const j = await r.json().catch(() => ({}));
        const thread = (j.threads || []).find((t: Thread) => t.id === id) || null;
        return { thread };
      } catch {
        return { thread: null };
      }
    }
    return { thread: null };
  })(ctx);
};

export default function ThreadPage({ thread, session }: Props) {
  const router = useRouter();
  const q = router.query as { id: string; to?: string; jobId?: string; title?: string };
  const [tid, setTid] = React.useState(q.id);
  const { messages, send, markRead } = useThread(tid);
  React.useEffect(() => { if (tid !== 'new') markRead(); }, [tid, markRead]);
  const [body, setBody] = React.useState('');
  const bottomRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  React.useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
  const onSend = async () => {
    if (!body.trim()) return;
    if (tid === 'new') {
      const r = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ toId: q.to, jobId: q.jobId, title: q.title }),
      });
      const j = await r.json().catch(() => ({}));
      const nid = j.thread?.id;
      if (nid) {
        await fetch(`/api/messages/${nid}`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ body }),
        });
        setTid(nid);
        router.replace(`/messages/${nid}`);
      }
    } else {
      await send(body);
    }
    setBody('');
    inputRef.current?.focus();
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 0);
  };
  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };
  return (
    <ProductShell>
      <HeadSEO title={thread?.title || t('messages.title')} noIndex />
      <div style={{ overflow: 'auto', maxHeight: 'calc(100vh - 220px)', border: '1px solid #ddd', padding: 8 }}>
        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} selfId={session?.id || ''} />
        ))}
        <div ref={bottomRef} />
      </div>
      <div style={{ marginTop: 8, display: 'flex', gap: 4, position: 'sticky', bottom: 0, backdropFilter: 'blur(6px)', background: '#fff', padding: 8 }}>
        <textarea
          ref={inputRef}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={t('messages.placeholder')}
          style={{ flex: 1 }}
        />
        <button onClick={onSend} disabled={!body.trim()}>{t('messages.send')}</button>
      </div>
    </ProductShell>
  );
}
