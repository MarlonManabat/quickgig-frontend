import { supabase } from "@/utils/supabaseClient";

export function subscribeToThread(
  threadId: string,
  onInsert: (row: any) => void,
) {
  const ch = supabase
    .channel(`messages:thread:${threadId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `thread_id=eq.${threadId}`,
      },
      (payload) => onInsert(payload.new),
    )
    .subscribe();
  return () => {
    supabase.removeChannel(ch);
  };
}
