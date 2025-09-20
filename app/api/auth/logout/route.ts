import { buildLogoutResponse } from '@/lib/auth-responses';

export async function POST(request: Request) {
  const url = new URL(request.url);
  const next = url.searchParams.get('next') ?? '/browse-jobs';
  return buildLogoutResponse(request, next);
}

export async function GET(request: Request) {
  return POST(request);
}
