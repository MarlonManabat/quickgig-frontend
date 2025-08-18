'use client';
import { useState } from 'react';

type Props = { onSend: (body: string) => Promise<void> };

export const Composer: React.FC<Props> = ({ onSend }) => {
  const [text, setText] = useState('');
  return (
    <form
      onSubmit={async e => {
        e.preventDefault();
        const t = text;
        setText('');
        await onSend(t);
      }}
      className="flex gap-2 mt-2"
    >
      <input
        className="flex-1 border p-2"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Type a message"
      />
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white">Send</button>
    </form>
  );
};
