#!/usr/bin/env node
/* eslint-disable no-console */

const BASE = process.env.BASE || process.env.NEXT_PUBLIC_API_URL || 'https://api.quickgig.ph';
const TIMEOUT = 5000;

const endpoints = [
  { path: '/', expect: { key: 'message', value: 'QuickGig API' } },
  { path: '/health', expect: { key: 'status', value: 'ok' } },
];

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

async function check(ep) {
  const url = `${BASE}${ep.path}`;
  let status = 0;
  let body = '';
  let pass = false;
  try {
    const res = await fetchWithTimeout(url);
    status = res.status;
    body = await res.text();
    const json = (() => { try { return JSON.parse(body); } catch { return null; } })();
    pass = res.ok && json && json[ep.expect.key] === ep.expect.value;
  } catch (err) {
    body = String(err.message || err);
  }
  return { path: ep.path, status, pass, body: trim(body) };
}

(async () => {
  const rows = [];
  for (const ep of endpoints) rows.push(await check(ep));

  console.log('Endpoint | Code | Result | Body');
  for (const r of rows) {
    console.log(`${r.path} | ${r.status} | ${r.pass ? 'PASS' : 'FAIL'} | ${r.body}`);
  }

  const allPass = rows.every((r) => r.pass);
  process.exit(allPass ? 0 : 1);
})();

