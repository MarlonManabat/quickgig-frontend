import { NextResponse } from 'next/server';
import { APPLICATIONS_COOKIE, cookieOptionsForHost } from '@/lib/applications';

export async function POST() {
  const res = new NextResponse(null, { status: 204 });
  const opts = cookieOptionsForHost();
  res.cookies.set(APPLICATIONS_COOKIE, '', { ...opts, maxAge: 0 });
  return res;
}

