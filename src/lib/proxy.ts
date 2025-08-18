import { NextRequest, NextResponse } from 'next/server';

const hopByHop = new Set([
  'connection','keep-alive','proxy-authenticate','proxy-authorization',
  'te','trailer','transfer-encoding','upgrade'
]);

export async function proxyPhp(
  req: NextRequest,
  phpPath: string,                      // e.g. '/login.php'
  init?: RequestInit
) {
  const base = process.env.NEXT_PUBLIC_API_URL || 'https://quickgig.ph';
  const url = new URL(phpPath, base).toString();

  // Pass-through body. For form posts we keep the raw text.
  const method = req.method;
  const headers: Record<string,string> = {};
  req.headers.forEach((v,k) => { if (!hopByHop.has(k.toLowerCase())) headers[k] = v; });

  let body: BodyInit | undefined;
  if (method !== 'GET' && method !== 'HEAD') {
    // Keep original body for PHP (form-urlencoded / JSON).
    const contentType = req.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      body = JSON.stringify(await req.json());
      headers['content-type'] = 'application/json';
    } else {
      body = await req.text();
      if (!contentType) headers['content-type'] = 'application/x-www-form-urlencoded';
    }
  }

  const upstream = await fetch(url, {
    method,
    headers,
    body,
    // credentials are server-to-server here; cookies come from PHP back to us via Set-Cookie
    redirect: 'manual',
    ...init,
  });

  // Copy headers back, including Set-Cookie
  const resHeaders = new Headers();
  upstream.headers.forEach((v,k) => {
    if (!hopByHop.has(k.toLowerCase())) resHeaders.set(k, v);
  });

  const buf = Buffer.from(await upstream.arrayBuffer());
  return new NextResponse(buf, { status: upstream.status, headers: resHeaders });
}
