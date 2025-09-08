import { redirect } from 'next/navigation';
import { sanitizeNext } from '@/lib/safeNext';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const next = sanitizeNext(url.searchParams.get('next'));
  const qs = next ? `?next=${encodeURIComponent(next)}` : '';
  redirect(`/api/auth/pkce/start${qs}`);
}
