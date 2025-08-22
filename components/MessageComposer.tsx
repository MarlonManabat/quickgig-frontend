import { useState } from "react";

export default function MessageComposer({ onSend }: { onSend: (body: string) => Promise<void> }) {
  const [body, setBody] = useState("");

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        if (!body.trim()) return;
        await onSend(body);
        setBody("");
      }}
      className="flex gap-2 mt-2"
    >
      <input
        className="flex-1 rounded bg-slate-800 px-3 py-2"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Type a message..."
      />
      <button type="submit" className="rounded bg-yellow-400 text-black px-3">
        Send
      </button>
    </form>
  );
}
