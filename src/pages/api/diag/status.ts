import type { NextApiRequest, NextApiResponse } from 'next';
import { BASE } from '../../../../lib/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end();
  }

  const baseUrl = BASE.replace(/\/$/, '');
  const headers = {
    Accept: 'application/json',
    'User-Agent': 'QuickGigDiag/1.0',
  } as const;
  const start = Date.now();

  async function attempt(path: '/status' | '/health.php') {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    try {
      const r = await fetch(`${baseUrl}${path}`, {
        headers,
        signal: controller.signal,
      });
      const status = r.status;
      const contentType = r.headers.get('content-type');
      const text = await r.text();

      if (status === 200 && contentType && contentType.startsWith('application/json')) {
        try {
          const backend = JSON.parse(text);
          return { ok: true as const, backend, used: path };
        } catch (err) {
          return {
            ok: false as const,
            status,
            used: path,
            contentType,
            sample: text.slice(0, 160),
            message: err instanceof Error ? err.message : String(err),
          };
        }
      }

      return {
        ok: false as const,
        status,
        used: path,
        contentType,
        sample: text.slice(0, 160),
        message: `unexpected status ${status} or content-type ${contentType}`,
      };
    } catch (err) {
      return {
        ok: false as const,
        status: 0,
        used: path,
        contentType: null,
        sample: '',
        message: err instanceof Error ? err.message : String(err),
      };
    } finally {
      clearTimeout(timer);
    }
  }

  let result = await attempt('/status');
  if (!result.ok) {
    result = await attempt('/health.php');
  }

  if (result.ok) {
    const durationMs = Date.now() - start;
    return res.status(200).json({ ok: true, used: result.used, baseUrl, backend: result.backend, durationMs });
  }

  return res
    .status(502)
    .json({
      ok: false,
      baseUrl,
      status: result.status,
      used: result.used,
      contentType: result.contentType,
      sample: result.sample,
      message: result.message,
    });
}

