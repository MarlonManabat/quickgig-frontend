import { env } from '@/config/env';

/**
 * Proxy a request to the PHP backend, optionally falling back to
 * form-urlencoded if JSON is rejected (415 or HTML response).
 * Logs method, path, status and duration to the Vercel runtime logs.
 */
export async function proxyFetch(
  path: string,
  opts: {
    method?: string;
    body?: Record<string, unknown>;
    headers?: Record<string, string>;
    formFallback?: boolean;
  } = {}
) {
  const url = `${env.API_URL}${path}`;
  const method = opts.method ?? 'GET';
  const start = Date.now();

  const baseHeaders: Record<string, string> = { ...(opts.headers || {}) };
  let body: BodyInit | undefined;

  if (opts.body) {
    baseHeaders['Content-Type'] = 'application/json';
    body = JSON.stringify(opts.body);
  }

  let res: Response;
  try {
    res = await fetch(url, { method, headers: baseHeaders, body });

    const ct = res.headers.get('content-type') || '';
    if (
      opts.body &&
      opts.formFallback &&
      (res.status === 415 || ct.includes('text/html'))
    ) {
      const form = new URLSearchParams();
      for (const [k, v] of Object.entries(opts.body)) {
        form.append(k, String(v ?? ''));
      }
      res = await fetch(url, {
        method,
        headers: { ...(opts.headers || {}), 'Content-Type': 'application/x-www-form-urlencoded' },
        body: form.toString(),
      });
    }
  } catch (err) {
    const duration = Date.now() - start;
    console.log(`${method} ${path} ERR ${duration}ms`);
    throw err;
  }

  const duration = Date.now() - start;
  console.log(`${method} ${path} ${res.status} ${duration}ms`);

  const data = await parseSafe(res);
  return { res, data };
}

export async function parseSafe(res: Response) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
