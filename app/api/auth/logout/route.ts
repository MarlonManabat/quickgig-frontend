import { buildLogoutResponse } from '@/lib/auth-responses';

const AUTH_COOKIE = 'qg_auth';

export async function POST(request: Request) {
  const url = new URL(request.url);
  const next = url.searchParams.get('next');
  const response = buildLogoutResponse(request, next ?? '/browse-jobs');
  response.cookies.set(AUTH_COOKIE, '', {
    path: '/',
    httpOnly: false,
    expires: new Date(0),
  });
  return response;
}

export async function GET(request: Request) {
  return POST(request);
}
