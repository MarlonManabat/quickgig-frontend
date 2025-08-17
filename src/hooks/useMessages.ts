'use client';
import { useState, useEffect } from 'react';
import { usePolling } from './usePolling';
import { useAuth } from '@/context/AuthContext';
import type { Message } from '@/types/messages';

export function useUnreadCount() {
  const { isAuthenticated } = useAuth();
  const [count, setCount] = useState(0);
  const fetchCount = async () => {
    try {
      const r = await fetch('/api/messages?count=1');
      const j = await r.json().catch(() => ({}));
      setCount(j.count || 0);
    } catch {
      setCount(0);
    }
  };
  useEffect(() => {
    if (isAuthenticated) fetchCount();
  }, [isAuthenticated]);
  usePolling(fetchCount, 20000, { enabled: isAuthenticated });
  return count;
}

export function useThread(id: string) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  useEffect(() => {
    if (!id || !user) return;
    let alive = true;
    (async () => {
      try {
        const r = await fetch(`/api/messages/${id}`);
        const j = await r.json().catch(() => ({}));
        if (alive) setMessages(j.messages || []);
      } catch {
        if (alive) setMessages([]);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id, user]);
  const send = async (body: string) => {
    const temp: Message = {
      id: `tmp-${Date.now()}`,
      threadId: id,
      fromId: user?.id || '',
      toId: '',
      body,
      createdAt: new Date().toISOString(),
      read: false,
    };
    setMessages((m) => [...m, temp]);
    try {
      await fetch(`/api/messages/${id}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ body }),
      });
    } catch {}
  };
  const markRead = async () => {
    try {
      await fetch(`/api/messages/${id}`, { method: 'PUT' });
    } catch {}
  };
  return { messages, send, markRead };
}
