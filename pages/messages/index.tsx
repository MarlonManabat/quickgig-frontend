import { useEffect, useState } from 'react';
import LinkSafe from '@/components/LinkSafe';
import { supabase } from '@/utils/supabaseClient';

type Thread = { id: string; last_sender?: string };

export default function MessagesList() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
    (async () => {
      const { data } = await supabase
        .from('threads')
        .select('id, messages(id, sender_id, created_at)')
        .order('updated_at', { ascending: false });
      if (data) {
        const mapped = (data as any[]).map((t: any) => {
          const last = (t.messages || []).sort(
            (a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          )[t.messages.length - 1];
          return { id: t.id, last_sender: last?.sender_id } as Thread;
        });
        setThreads(mapped);
      }
    })();
  }, []);

  return (
    <div className="p-4 space-y-2">
      {threads.map(t => (
        <LinkSafe
          key={t.id}
          href="/messages/[id]"
          params={{ id: t.id }}
          data-testid="thread-row"
          className="block border-b py-2"
        >
          <span>Thread {t.id}</span>
          {t.last_sender && t.last_sender !== userId && (
            <span className="ml-2 text-xs text-red-600">NEW</span>
          )}
        </LinkSafe>
      ))}
      {!threads.length && <p>No messages.</p>}
    </div>
  );
}

