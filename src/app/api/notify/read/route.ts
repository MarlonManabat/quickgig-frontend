import { NextResponse } from 'next/server';
import { env } from '@/config/env';
import { markRead, getItems, calcCounts } from '../_store';

export async function POST(req: Request) {
  if (!env.NEXT_PUBLIC_ENABLE_NOTIFY_CENTER) {
    return NextResponse.json({ skipped: true });
  }
  const { id } = await req.json().catch(() => ({ id: '' }));
  if (id) markRead(id);
  const items = getItems();
  return NextResponse.json({ items, counts: calcCounts(items) });
}
