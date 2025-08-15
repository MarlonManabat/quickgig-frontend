import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { env } from '@/config/env';
import { API } from '@/config/api';

export async function GET(req: NextRequest) {
  const token = req.cookies.get(env.JWT_COOKIE_NAME)?.value;
  if (!token) return NextResponse.json({ ok: false }, { status: 401 });

  const headers: Record<string, string> = {
    Cookie: `${env.JWT_COOKIE_NAME}=${token}`,
  };
  headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${env.API_URL}${API.me}`, {
    headers,
    cache: 'no-store',
  });
  const data = await res.json();

  let isEmployer: boolean | undefined = data.isEmployer;
  if (typeof isEmployer !== 'boolean' && data.user?.role) {
    isEmployer = data.user.role === 'Employer';
  }
  if (typeof isEmployer !== 'boolean' && data.user?.email) {
    isEmployer = env.EMPLOYER_EMAILS.includes(data.user.email);
  }
  if (typeof isEmployer !== 'boolean') {
    isEmployer = false;
  }
  data.isEmployer = isEmployer;

  const response = NextResponse.json(data, { status: res.status });
  if (data.user?.role) {
    response.cookies.set('role', data.user.role);
  }
  if (data.user?.email) {
    response.cookies.set('email', data.user.email);
  }
  response.cookies.set('isEmployer', String(isEmployer));

  return response;
}
