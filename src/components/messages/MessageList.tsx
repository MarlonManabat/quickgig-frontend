'use client';
import { FC } from 'react';
import { Message } from '@/types/messages';

type Props = { messages: Message[] };

export const MessageList: FC<Props> = ({ messages }) => (
  <div className="space-y-2">
    {messages.map((m, i) => (
      <div key={i} className="p-2 border rounded">
        <div className="text-sm text-gray-600">{m.from}</div>
        <div>{m.body}</div>
      </div>
    ))}
  </div>
);
