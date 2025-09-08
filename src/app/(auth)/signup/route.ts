import { redirect } from 'next/navigation';
import { sanitizeNext } from '@/lib/safeNext';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const next = sanitizeNext(url.searchParams.get('next'));
  const qs = new URLSearchParams();
  if (next) qs.set('next', next);
  qs.set('mode', 'signup');
  redirect(`/api/auth/pkce/start?${qs.toString()}`);
}
