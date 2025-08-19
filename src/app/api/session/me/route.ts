import { NextResponse } from 'next/server';
import { gateway } from '@/lib/gateway';

export const runtime = 'nodejs';

export async function GET() {
  const upstream = await gateway('/auth/me');
  const data = await upstream.json().catch(() => ({}));
  const res = NextResponse.json(data, { status: upstream.status });
  res.headers.set('Cache-Control', 'no-store');
  return res;
}
