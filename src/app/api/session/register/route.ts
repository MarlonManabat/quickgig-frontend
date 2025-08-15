import { NextResponse } from 'next/server';
import { API } from '@/config/api';
import { proxyFetch } from '@/server/proxy';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  try {
    const { res, data } = await proxyFetch(API.register, {
      method: 'POST',
      body,
      formFallback: true,
    });

    const d =
      typeof data === 'object' && data
        ? (data as Record<string, unknown>)
        : ({} as Record<string, unknown>);

    if (res.ok) {
      return NextResponse.json({ ok: true, ...d }, { status: 200 });
    }

    const message =
      typeof d['message'] === 'string'
        ? (d['message'] as string)
        : typeof d['error'] === 'string'
          ? (d['error'] as string)
          : 'Registration failed';

    return NextResponse.json({ ok: false, message }, { status: 200 });
  } catch {
    return NextResponse.json(
      { ok: false, message: 'Auth service unreachable' },
      { status: 200 }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 200 });
}
