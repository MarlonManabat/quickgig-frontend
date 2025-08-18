import { NextResponse } from 'next/server';
import { env } from '@/config/env';
import { addItem } from '../_store';
import { broadcast } from '../_sse';

export async function POST() {
  if (!env.NEXT_PUBLIC_ENABLE_NOTIFY_CENTER) {
    return NextResponse.json({ skipped: true });
  }
  const item = {
    id: `mock-${Date.now()}`,
    kind: 'message',
    title: 'mock',
    createdAt: new Date().toISOString(),
    unread: true,
  } as const;
  addItem(item);
  broadcast(item);
  return NextResponse.json({ ok: true });
}
