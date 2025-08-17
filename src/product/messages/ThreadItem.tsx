import * as React from 'react';
import Link from 'next/link';
import type { Thread } from '@/types/messages';

export default function ThreadItem({ thread, selfId }: { thread: Thread; selfId: string }) {
  const unread = thread.unreadFor?.includes(selfId);
  return (
    <Link
      href={`/messages/${thread.id}`}
      style={{
        display: 'block',
        padding: 8,
        borderBottom: '1px solid #ddd',
        background: unread ? '#eef' : '#fff',
      }}
    >
      <div style={{ fontWeight: 600 }}>{thread.title || thread.id}</div>
      <div style={{ fontSize: 12, color: '#666' }}>{new Date(thread.lastMessageAt).toLocaleString()}</div>
      {unread && <span style={{ float: 'right', width: 8, height: 8, background: '#d00', borderRadius: 4 }} />}
    </Link>
  );
}
