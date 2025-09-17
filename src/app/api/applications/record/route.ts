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
  const now = Date.now();
  let current: Array<{ id: string; ts: number }> = [];
  try {
    const parsed = cookie ? JSON.parse(cookie) : [];
    if (Array.isArray(parsed)) {
      current = parsed
        .map((entry) => {
          const rawId = (entry as { id?: unknown }).id;
          if (rawId == null) return null;
          return {
            id: String(rawId),
            ts: Number((entry as { ts?: unknown }).ts) || now,
          };
        })
        .filter((entry): entry is { id: string; ts: number } => Boolean(entry));
    }
  } catch {
    current = [];
  }
  const seen = new Set<string>();
  const next = [{ id, ts: now }, ...current]
    .filter((entry) => {
      if (seen.has(entry.id)) return false;
      seen.add(entry.id);
      return true;
    })
    .slice(0, 100);

  const res = new NextResponse(null, { status: 204 });
  res.cookies.set(APPLICATIONS_COOKIE, JSON.stringify(next), cookieOptionsForHost());
  return res;
}

