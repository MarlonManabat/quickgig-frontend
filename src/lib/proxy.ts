import { NextRequest, NextResponse } from 'next/server';

const hopByHop = new Set([
  'connection',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailer',
  'transfer-encoding',
  'upgrade',
]);

export async function proxyPhp(req: NextRequest, phpPath: string, init?: RequestInit) {
  const base = process.env.NEXT_PUBLIC_API_URL || 'https://quickgig.ph';
  const url = new URL(phpPath, base).toString();

  const method = req.method;
  const headers: Record<string, string> = {};
  req.headers.forEach((v, k) => {
    if (!hopByHop.has(k.toLowerCase())) headers[k] = v;
  });

  let body: BodyInit | undefined;
  if (method !== 'GET' && method !== 'HEAD') {
    const ct = req.headers.get('content-type') || '';
    if (ct.includes('application/json')) {
      body = JSON.stringify(await req.json());
      headers['content-type'] = 'application/json';
    } else {
      body = await req.text();
      if (!ct) headers['content-type'] = 'application/x-www-form-urlencoded';
    }
  }

  const upstream = await fetch(url, {
    method,
    headers,
    body,
    redirect: 'manual',
    cache: 'no-store',
    ...init,
  });

  const resHeaders = new Headers();
  upstream.headers.forEach((v, k) => {
    if (!hopByHop.has(k.toLowerCase())) resHeaders.set(k, v);
  });

  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers: resHeaders,
  });
}
