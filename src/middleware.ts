import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // Only guard GET /login (form posts go to /api/session/login)
  if (req.method === 'GET' && url.pathname === '/login') {
    const to = url.clone();
    to.pathname = '/next-login';
    return NextResponse.rewrite(to);
  }
  return NextResponse.next();
}
export const config = { matcher: ['/login'] };

