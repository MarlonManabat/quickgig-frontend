import * as React from 'react';
import type { Message } from '@/types/messages';

export default function MessageBubble({ message, selfId }: { message: Message; selfId: string }) {
  const mine = message.fromId === selfId;
  return (
    <div style={{ textAlign: mine ? 'right' : 'left', margin: '4px 0' }}>
      <div
        style={{
          display: 'inline-block',
          background: mine ? '#dcf8c6' : '#fff',
          padding: '6px 8px',
          borderRadius: 8,
          border: '1px solid #ccc',
          maxWidth: '80%',
        }}
      >
        {message.body}
      </div>
    </div>
  );
}
