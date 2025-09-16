import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { APPLICATIONS_COOKIE, cookieOptionsForHost } from '@/lib/applications';

export async function POST(req: NextRequest) {
  let id: string | null = null;
  try {
    const body = await req.json();
    if (body && (body.id ?? body.jobId) != null) {
      id = String(body.id ?? body.jobId);
    }
  } catch {}

  if (!id) return new NextResponse('missing jobId', { status: 400 });

  const cookie = req.cookies.get(APPLICATIONS_COOKIE)?.value;
  let current: string[] = [];
  try {
    current = cookie ? JSON.parse(cookie) : [];
    if (!Array.isArray(current)) current = [];
  } catch {
    current = [];
  }
  if (!current.includes(id)) current.unshift(id);
  current = current.slice(0, 100);

  const res = new NextResponse(null, { status: 204 });
  res.cookies.set(APPLICATIONS_COOKIE, JSON.stringify(current), cookieOptionsForHost());
  return res;
}

