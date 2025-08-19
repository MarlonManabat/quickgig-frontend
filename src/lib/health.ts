import { safeFetch, checkHealth } from './api';
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
  const results: HealthResult[] = [];

  // Root check
  const rootStart = Date.now();
  const rootRes = await safeFetch('/');
  const rootLatency = Date.now() - rootStart;
  const rootParsed = safeJsonParse<Record<string, unknown>>(rootRes.body);
  const rootPass =
    rootRes.ok &&
    rootParsed.ok &&
    rootParsed.value &&
    rootParsed.value['message'] === 'QuickGig API';
  results.push({
    path: '/',
    status: rootRes.status,
    pass: rootPass,
    body: rootRes.body.trim().slice(0, 200),
    latency: rootLatency,
  });

  // Health check with fallback
  const health = await checkHealth();
  let hint: string | undefined;
  if (!health.ok) {
    if (health.status === 404)
      hint = 'Ensure /status endpoint exists on backend';
    else if (health.status === 403)
      hint = 'Check Hostinger .htaccess or WAF rule; DirectoryIndex and RewriteEngine Off';
    else if (health.status === 500)
      hint = 'Check PHP extensions nd_mysqli / nd_pdo_mysql and DB creds (if used)';
  }
  results.push({
    path: health.path,
    status: health.status,
    pass: health.ok,
    body: health.body.trim().slice(0, 200),
    latency: health.latency,
    hint,
  });

  return results;
}

