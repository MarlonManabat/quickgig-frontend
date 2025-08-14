#!/usr/bin/env node
/* eslint-disable no-console */

const BASE = process.env.BASE || 'https://quickgig.ph';
const TIMEOUT = 10000;
const paths = ['/', '/health-check'];

async function fetchWithTimeout(url) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), TIMEOUT);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(t);
  }
}

async function check(path) {
  const url = `${BASE}${path}`;
  let status = 0;
  let pass = false;
  let body = '';
  try {
    const res = await fetchWithTimeout(url);
    status = res.status;
    body = await res.text();
    pass = res.ok;
  } catch (err) {
    body = String(err.message || err);
  }
  return { path, status, pass, body: body.trim().slice(0, 60) };
}

(async () => {
  const rows = [];
  for (const p of paths) rows.push(await check(p));
  console.log('Path | Code | Result | Body');
  for (const r of rows) {
    console.log(`${r.path} | ${r.status} | ${r.pass ? 'PASS' : 'FAIL'} | ${r.body}`);
  }
  const allPass = rows.every((r) => r.pass);
  process.exit(allPass ? 0 : 1);
})();

