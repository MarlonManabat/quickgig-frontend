import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const next = url.searchParams.get('next') || '/';
  const jar = cookies();
  ['sb-access-token', 'sb-refresh-token', 'qg_next'].forEach((n) => {
    try {
      // @ts-ignore – cookie typings differ across Next versions
      jar.delete(n);
    } catch {}
  });
  return NextResponse.redirect(new URL(next, url.origin), { status: 302 });
}
