import { useState } from 'react';

export default function MessageInput({ applicationId }: { applicationId: string }) {
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);

  const send = async () => {
    const body = text.trim();
    if (body.length < 1 || body.length > 4000) return;
    setSending(true);
    await fetch('/api/messages/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ applicationId, body }),
    });
    setSending(false);
    setText('');
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!sending) send();
    }
  };

  const disabled = sending || text.trim().length === 0 || text.length > 4000;

  return (
    <div className="mt-2 flex gap-2">
      <textarea
        className="flex-1 border rounded p-2"
        rows={2}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={onKeyDown}
        disabled={sending}
        data-testid="msg-input"
      />
      <button
        onClick={send}
        disabled={disabled}
        className="px-3 py-2 bg-brand-accent text-white rounded"
        data-testid="msg-send"
      >
        Send
      </button>
    </div>
  );
}
