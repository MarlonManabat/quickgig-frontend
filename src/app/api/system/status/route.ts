import { env } from '@/config/env';

export async function GET() {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 3000);
  try {
    const res = await fetch(`${env.API_URL}/system/status`, {
      signal: controller.signal,
      cache: 'no-store',
    });
    if (!res.ok) return Response.json({ ok: false });
    const data = await res.json().catch(() => ({}));
    const degraded = Boolean((data as { degraded?: boolean }).degraded);
    return Response.json({ ok: true, ...(degraded ? { degraded: true } : {}) });
  } catch {
    return Response.json({ ok: false });
  } finally {
    clearTimeout(timer);
  }
}
