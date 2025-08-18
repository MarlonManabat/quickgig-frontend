import { NextResponse } from 'next/server';
import { env } from '@/config/env';
import { getItems, calcCounts } from '../_store';

export async function GET() {
  if (!env.NEXT_PUBLIC_ENABLE_NOTIFY_CENTER) {
    return NextResponse.json({ skipped: true });
  }
  const items = getItems();
  return NextResponse.json({ items, counts: calcCounts(items) });
}
