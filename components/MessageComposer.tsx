import { useState } from "react";
import { supabase } from "@/utils/supabaseClient";

export default function MessageComposer({
  threadId,
  userId,
  onSent,
}: {
  threadId: string;
  userId: string;
  onSent?: (msg: any) => void;
}) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const disabled = sending || text.trim().length === 0 || text.length > 4000;
  async function send() {
    if (!text.trim()) return;
    setSending(true);
    const optimistic = {
      id: crypto.randomUUID(),
      thread_id: threadId,
      sender_id: userId,
      body: text,
      created_at: new Date().toISOString(),
    };
    onSent?.(optimistic);
    setText("");
    const { data, error } = await supabase
      .from("messages")
      .insert({ thread_id: threadId, sender_id: userId, body: optimistic.body })
      .select("*")
      .single();
    setSending(false);
    if (error) console.error(error);
    else onSent?.(data);
  }
  return (
    <div className="flex gap-2">
      <input
        data-testid="chat-input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 border rounded px-3 py-2"
        placeholder="Type a message…"
      />
      <button
        data-testid="chat-send"
        onClick={send}
        disabled={disabled}
        className="btn-primary px-4 py-2 rounded"
      >
        Send
      </button>
    </div>
  );
}
