import { NextResponse } from 'next/server';
import { API } from '@/config/api';
import { env } from '@/config/env';
import { parseSafe } from '@/server/proxy';

export async function POST(req: Request) {
  console.info('POST /api/session/register');
  const body = await req.json().catch(() => ({}));
  try {
    const res = await fetch(`${env.API_URL}${API.register}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      credentials: 'include',
    });
    const data = await parseSafe(res);
    const d =
      typeof data === 'object' && data
        ? (data as Record<string, unknown>)
        : ({} as Record<string, unknown>);
    if (res.ok) {
      console.info('POST /api/session/register', res.status);
      return NextResponse.json({ ok: true, ...d }, { status: res.status });
    }
    const message =
      typeof d['message'] === 'string'
        ? (d['message'] as string)
        : typeof d['error'] === 'string'
          ? (d['error'] as string)
          : 'Registration failed';
    console.info('POST /api/session/register', res.status, message);
    return NextResponse.json({ ok: false, message }, { status: res.status });
  } catch (err) {
    console.info('POST /api/session/register error', err);
    return NextResponse.json(
      { ok: false, message: 'Auth service unreachable' },
      { status: 500 },
    );
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 200 });
}

