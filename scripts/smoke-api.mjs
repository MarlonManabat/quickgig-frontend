#!/usr/bin/env node
/* eslint-disable no-console */

const BASE = (process.env.NEXT_PUBLIC_API_URL || 'https://api.quickgig.ph').replace(/\/$/, '');
const headers = {
  Accept: 'application/json',
  'User-Agent': 'QuickGigDiag/1.0',
};

async function tryPath(path) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);
  try {
    const res = await fetch(BASE + path, { headers, signal: controller.signal });
    const ct = res.headers.get('content-type');
    const text = await res.text();
    if (res.ok && ct && ct.startsWith('application/json')) {
      try {
        JSON.parse(text);
        console.log(`OK via ${path}`);
        console.log(text);
        process.exit(0);
      } catch {
        // fall through
      }
    }
  } catch (err) {
    console.error(`${path} error:`, err instanceof Error ? err.message : err);
  } finally {
    clearTimeout(timer);
  }
}

(async () => {
  await tryPath('/status');
  await tryPath('/health.php');
  console.error('API smoke failed');
  process.exit(1);
})();

