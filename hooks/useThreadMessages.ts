import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import { subscribeToThread } from "@/utils/realtime";

export type Message = {
  id: string;
  thread_id: string;
  sender_id: string;
  body: string;
  created_at: string;
};

export function useThreadMessages(threadId?: string, currentUserId?: string) {
  const [items, setItems] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(!!threadId);
  useEffect(() => {
    if (!threadId) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("thread_id", threadId)
        .order("created_at", { ascending: true });
      if (!cancelled) {
        if (!error && data) setItems(data as Message[]);
        setLoading(false);
      }
    })();
    const off = subscribeToThread(threadId, (row: any) =>
      setItems((prev) => {
        if (prev.some((m) => m.id === row.id)) return prev;
        return [...prev, row as Message];
      }),
    );
    return () => {
      cancelled = true;
      off?.();
    };
  }, [threadId]);
  const unreadCount = useMemo(() => {
    if (!currentUserId) return 0;
    // naive: messages not from me at end of list are "unread" until we open the thread; good enough for MVP
    return items.filter((m) => m.sender_id !== currentUserId).length ? 0 : 0; // placeholder; UI will show “NEW” badge when last msg not mine
  }, [items, currentUserId]);
  return { items, setItems, loading, unreadCount };
}
