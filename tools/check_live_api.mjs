#!/usr/bin/env node
/* eslint-disable no-console */

const BASE = process.env.BASE || process.env.NEXT_PUBLIC_API_URL || 'https://api.quickgig.ph';
const TIMEOUT = 10000;

function trim(str) {
  return str.length > 60 ? str.slice(0, 60) + '…' : str;
}

async function fetchWithTimeout(url) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), TIMEOUT);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(t);
  }
}

async function check(path, expect) {
  const url = `${BASE}${path}`;
  let status = 0;
  let body = '';
  let pass = false;
  try {
    const res = await fetchWithTimeout(url);
    status = res.status;
    body = await res.text();
    const json = (() => { try { return JSON.parse(body); } catch { return null; } })();
    pass = res.ok && json && json[expect.key] === expect.value;
  } catch (err) {
    body = String(err.message || err);
  }
  return { path, status, pass, body: trim(body) };
}

(async () => {
  const rows = [];
  // Root check
  rows.push(await check('/', { key: 'message', value: 'QuickGig API' }));

  // Health check with fallback
  let health = await check('/health', { key: 'status', value: 'ok' });
  if (!health.pass) health = await check('/health.php', { key: 'status', value: 'ok' });
  rows.push(health);

  console.log('Endpoint | Code | Result | Body');
  for (const r of rows) {
    console.log(`${r.path} | ${r.status} | ${r.pass ? 'PASS' : 'FAIL'} | ${r.body}`);
  }

  const allPass = rows.every((r) => r.pass);
  process.exit(allPass ? 0 : 1);
})();

