export function setCookie(headers: Headers, name: string, value: string, opts?: {
  domain?: string; path?: string; maxAge?: number; secure?: boolean; sameSite?: 'Lax'|'Strict'|'None'; httpOnly?: boolean;
}) {
  const parts = [`${name}=${encodeURIComponent(value)}`];
  parts.push(`Path=${opts?.path ?? '/'}`);
  if (opts?.domain) parts.push(`Domain=${opts.domain}`);
  if (opts?.maxAge != null) parts.push(`Max-Age=${opts.maxAge}`);
  parts.push(`SameSite=${opts?.sameSite ?? 'Lax'}`);
  if (opts?.secure !== false) parts.push('Secure');
  if (opts?.httpOnly !== false) parts.push('HttpOnly');
  headers.append('Set-Cookie', parts.join('; '));
}

export function clearCookie(headers: Headers, name: string, domain = '.quickgig.ph') {
  headers.append('Set-Cookie', `${name}=; Path=/; Domain=${domain}; Max-Age=0; SameSite=Lax; Secure; HttpOnly`);
}

export function readCookieFromRequest(req: Request, name: string): string | null {
  const raw = req.headers.get('cookie') ?? '';
  const m = raw.match(new RegExp('(?:^|; )' + name.replace(/([.*+?^${}()|[\]\\])/g,'\\$1') + '=([^;]*)'));
  return m ? decodeURIComponent(m[1]) : null;
}

