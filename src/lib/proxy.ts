// src/lib/proxy.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export function copySetCookie(from: Response, to: NextResponse) {
  const setCookie = from.headers.get('set-cookie');
  if (setCookie) to.headers.set('set-cookie', setCookie);
}

export async function jsonFrom(res: Response) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return text ? { message: text } : {};
  }
}

/** Clone incoming request cookies to outbound fetch */
export function withCookieHeaders(init: RequestInit = {}) {
  const jar = cookies()
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ');
  const headers = new Headers(init.headers);
  if (jar) headers.set('cookie', jar);
  return { ...init, headers };
}
