import { env } from '@/config/env';

async function tryFetch(url: string) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 3000);
  try {
    const res = await fetch(url, { signal: controller.signal });
    const text = await res.text();
    return { ok: res.ok, status: res.status, bodySnippet: text.slice(0, 120) };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function GET() {
  const base = env.API_URL.replace(/\/$/, '');
  const paths = ['/health', '/health.php', ''];
  for (const p of paths) {
    const result = await tryFetch(`${base}${p}`);
    if (result) {
      return Response.json(result);
    }
  }
  return Response.json({ ok: false });
}
