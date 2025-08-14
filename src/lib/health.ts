import { safeFetch } from './api';
import { safeJsonParse } from './json';

export interface HealthResult {
  path: string;
  status: number;
  pass: boolean;
  body: string;
  latency: number;
  hint?: string;
}

/** Run health checks against the QuickGig API. */
export async function runHealthChecks(): Promise<HealthResult[]> {
  const endpoints = [
    { path: '/', expect: { key: 'message', value: 'QuickGig API' } },
    { path: '/health', expect: { key: 'status', value: 'ok' } },
  ];

  const results: HealthResult[] = [];
  for (const ep of endpoints) {
    const start = Date.now();
    const res = await safeFetch(ep.path);
    const latency = Date.now() - start;
    const parsed = safeJsonParse<Record<string, unknown>>(res.body);
    const pass =
      res.ok &&
      parsed.ok &&
      parsed.value &&
      parsed.value[ep.expect.key] === ep.expect.value;

    let hint: string | undefined;
    if (!pass) {
      if (res.status === 404 && ep.path === '/health')
        hint = 'Ensure health.php exists at api docroot';
      else if (res.status === 403)
        hint = 'Check Hostinger .htaccess or WAF rule; DirectoryIndex and RewriteEngine Off';
      else if (res.status === 500)
        hint = 'Check PHP extensions nd_mysqli / nd_pdo_mysql and DB creds (if used)';
    }

    results.push({
      path: ep.path,
      status: res.status,
      pass,
      body: res.body.trim().slice(0, 200),
      latency,
      hint,
    });
  }

  return results;
}

