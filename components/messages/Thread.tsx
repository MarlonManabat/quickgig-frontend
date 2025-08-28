import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { timeAgo } from '@/utils/time';

interface Message {
  id: string;
  application_id: string;
  sender_id: string;
  body: string;
  created_at: string;
}

export default function Thread({ applicationId }: { applicationId: string }) {
  const [items, setItems] = useState<Message[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [uid, setUid] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUid(data.user?.id || null));
  }, []);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const res = await fetch(
        `/api/messages/history?applicationId=${applicationId}&limit=30`,
      );
      const json = await res.json();
      if (!cancelled) {
        setItems(json.items || []);
        if (json.items?.length) setCursor(json.items[0].created_at);
        listRef.current?.scrollTo(0, listRef.current.scrollHeight);
      }
    };
    load();
    const ch = supabase
      .channel(`messages:${applicationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `application_id=eq.${applicationId}`,
        },
        (payload) => {
          setItems((prev) => [...prev, payload.new as Message]);
          const m = payload.new as Message;
          if (m.sender_id === uid) {
            setTimeout(
              () => listRef.current?.scrollTo(0, listRef.current!.scrollHeight),
              0,
            );
          } else if (uid) {
            supabase
              .from('notifications')
              .update({ read: true })
              .eq('user_id', uid)
              .eq('link', `/applications/${applicationId}`);
          }
        },
      )
      .subscribe();
    return () => {
      cancelled = true;
      supabase.removeChannel(ch);
    };
  }, [applicationId, uid]);

  const loadOlder = async () => {
    if (!cursor) return;
    const res = await fetch(
      `/api/messages/history?applicationId=${applicationId}&cursor=${encodeURIComponent(
        cursor,
      )}&limit=30`,
    );
    const json = await res.json();
    if (json.items?.length) {
      setItems((prev) => [...json.items, ...prev]);
      setCursor(json.items[0].created_at);
    }
  };

  useEffect(() => {
    if (!uid) return;
    supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', uid)
      .eq('link', `/applications/${applicationId}`);
  }, [uid, applicationId]);

  return (
    <div className="space-y-2">
      {cursor && (
        <button
          onClick={loadOlder}
          className="text-sm underline"
          data-testid="btn-load-older"
        >
          Load older
        </button>
      )}
      <div
        ref={listRef}
        className="flex flex-col gap-2 max-h-80 overflow-y-auto"
      >
        {items.map((m) => {
          const mine = uid === m.sender_id;
          return (
            <div
              key={m.id}
              data-testid="msg-bubble"
              className={`flex flex-col ${mine ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`px-3 py-2 rounded-2xl max-w-[80%] ${
                  mine
                    ? 'bg-brand-accent text-white'
                    : 'bg-brand-surface text-brand'
                }`}
              >
                {m.body}
              </div>
              <div className="text-xs text-brand-subtle">
                {timeAgo(m.created_at)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
