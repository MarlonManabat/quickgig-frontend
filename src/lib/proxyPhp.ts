import { NextRequest } from 'next/server';
import { env } from '@/config/env';

const PHP_BASE = env.NEXT_PUBLIC_API_URL || 'https://quickgig.ph'; // public domain base (legacy host)

function rewriteSetCookie(headers: Headers) {
  const all = headers.getSetCookie?.() as unknown as string[] | undefined;
  if (!all || !all.length) return;

  const sanitized = all.map((c) => {
    // remove Domain attr
    let out = c.replace(/;?\s*Domain=[^;]+/gi, "");
    // ensure Secure
    if (!/;\s*Secure\b/i.test(out)) out += "; Secure";
    // normalize SameSite (keep None if explicitly set)
    if (!/;\s*SameSite=/i.test(out)) out += "; SameSite=Lax";
    return out;
  });

  headers.delete("set-cookie");
  sanitized.forEach((c) => headers.append("set-cookie", c));
}

export async function proxyPhp(req: NextRequest, path: string, init?: RequestInit) {
  const url = new URL(path, PHP_BASE).toString();
  const hopByHop = ["connection","keep-alive","transfer-encoding","upgrade","proxy-authenticate","proxy-authorization","te","trailer"];
  const fwdHeaders = new Headers(req.headers);

  hopByHop.forEach((h) => fwdHeaders.delete(h));
  fwdHeaders.set("accept", fwdHeaders.get("accept") || "*/*");
  fwdHeaders.set("cache-control", "no-store");
  // pass credentials context; php will send Set-Cookie back
  const upstream = await fetch(url, {
    method: req.method,
    headers: fwdHeaders,
    body: ["GET","HEAD"].includes(req.method) ? undefined : req.body,
    redirect: "manual",
    ...init,
  });

  // copy headers & rewrite cookies
  const outHeaders = new Headers(upstream.headers);
  rewriteSetCookie(outHeaders);

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: outHeaders,
  });
}

