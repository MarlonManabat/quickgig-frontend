'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';

interface Conv {
  id: string | number;
  otherName?: string;
  jobTitle?: string;
  lastMessage?: string;
  updatedAt?: string;
  unread?: number;
}

export default function MessagesPage() {
  const [list, setList] = useState<Conv[]>([]);
  const [q, setQ] = useState('');

  useEffect(() => {
    fetch('/api/msg/list')
      .then((r) => r.json())
      .then((d) => setList(d.conversations || d.data || []))
      .catch(() => {});
  }, []);

  const filtered = list.filter((c) => {
    const hay = `${c.otherName || ''} ${c.jobTitle || ''}`.toLowerCase();
    return hay.includes(q.toLowerCase());
  });

  return (
    <main className="p-4">
      <h1 className="text-2xl mb-4">Messages</h1>
      <Input
        placeholder="Search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="mb-4"
      />
      {filtered.length === 0 ? (
        <p>No conversations yet.</p>
      ) : (
        <ul className="space-y-2">
          {filtered.map((c) => (
            <li key={c.id}>
              <Link
                href={`/messages/${c.id}`}
                className="block border rounded p-3 hover:bg-qg-navy-light"
              >
                <div className="font-medium">{c.otherName || 'Unknown'}</div>
                {c.jobTitle && (
                  <div className="text-sm text-gray-500">{c.jobTitle}</div>
                )}
                {c.lastMessage && (
                  <div className="text-sm truncate">{c.lastMessage}</div>
                )}
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>
                    {c.updatedAt ? new Date(c.updatedAt).toLocaleString() : ''}
                  </span>
                  {c.unread ? (
                    <span className="bg-qg-accent text-white rounded-full px-2">
                      {c.unread}
                    </span>
                  ) : null}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
