import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const GATE = process.env.NEXT_PUBLIC_GATE_ORIGIN || 'https://api.quickgig.ph';
const COOKIE = process.env.JWT_COOKIE_NAME || 'qg.sid';

export async function POST(req: Request) {
  try {
      const body = await req.json();
      const r = await fetch(`${GATE}/session/login`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
        cache: 'no-store',
      });

    // Forward errors verbatim
    if (!r.ok) {
      const msg = await r.text().catch(() => '');
      return NextResponse.json({ ok: false, error: msg || r.statusText }, { status: r.status });
    }

    // Prefer Set-Cookie from upstream if present
    const setCookie = r.headers.get('set-cookie');
    if (setCookie) {
      // Pass through upstream cookie(s)
      return new NextResponse(await r.text(), {
        status: 200,
        headers: { 'set-cookie': setCookie, 'content-type': 'application/json' },
      });
    }

      // Or set our own cookie if upstream returns a token body
      const json: Record<string, unknown> = await r.json().catch(() => ({}));
      const token =
        (typeof json.token === 'string' ? json.token : undefined) ||
        (typeof json[COOKIE] === 'string' ? (json[COOKIE] as string) : undefined);
      if (token) {
        cookies().set({
          name: COOKIE,
          value: token,
          httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
      });
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: true }); // successful but cookie set by upstream via other means
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'login failed';
      return NextResponse.json({ ok: false, error: msg }, { status: 500 });
    }
  }
