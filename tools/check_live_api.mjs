#!/usr/bin/env node
/* eslint-disable no-console */
const baseUrlFromEnv = process.env.NEXT_PUBLIC_API_URL;
const args = new Map(process.argv.slice(2).map(a => {
  const [k, ...rest] = a.replace(/^--/, '').split('=');
  return [k, rest.length ? rest.join('=') : true];
}));

const BASE = args.get('base') || baseUrlFromEnv || 'https://api.quickgig.ph';
const ORIGIN = args.get('origin') || 'https://quickgig.ph';
const TIMEOUT_MS = Number(args.get('timeout') || 8000);
const SOFT = !!args.get('soft');  // if true, never exit non-zero

const endpoints = [
  { path: '/',       required: true,  expect: { key: 'message', value: 'QuickGig API' } },
  { path: '/health', required: true,  expect: { key: 'status',  value: 'ok' } },
];

function trimBody(b) {
  if (!b) return '';
  const s = String(b).replace(/\s+/g, ' ');
  return s.length > 300 ? s.slice(0, 300) + '…' : s;
}

async function fetchWithTimeout(url) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal, headers: { Origin: ORIGIN } });
    return res;
  } finally {
    clearTimeout(t);
  }
}

async function check(ep) {
  const url = `${BASE}${ep.path}`;
  let code = 0, body = '', result = 'FAIL', hint = '';
  try {
    const res = await fetchWithTimeout(url);
    code = res.status;
    const text = await res.text();
    body = trimBody(text);
    // Attempt JSON parse
    let json = null;
    try { json = JSON.parse(text); } catch (_) {}

    if (res.ok && json && ep.expect && json[ep.expect.key] === ep.expect.value) {
      result = 'PASS';
    } else if (res.ok && ep.expect && json && json[ep.expect.key] !== ep.expect.value) {
      result = 'FAIL (schema)';
      hint = `Expected ${ep.expect.key}=${ep.expect.value}`;
    } else if (!res.ok) {
      result = `FAIL (${code})`;
    }
  } catch (e) {
    result = `FAIL (${e.name === 'AbortError' ? 'timeout' : 'network'})`;
    hint = (e && e.message) || String(e);
  }
  return { path: ep.path, code, body, result, hint };
}

(async () => {
  console.log(`QuickGig API check @ ${BASE} (timeout ${TIMEOUT_MS}ms)`);
  const rows = [];
  for (const ep of endpoints) rows.push(await check(ep));

  // Pretty table
  const header = ['Endpoint', 'HTTP', 'Result', 'Body snippet', 'Hint'];
  const widths = [10, 5, 14, 50, 40];
  const pad = (s, w) => (s + '').padEnd(w).slice(0, w);
  console.log(
    pad(header[0], widths[0]),
    pad(header[1], widths[1]),
    pad(header[2], widths[2]),
    pad(header[3], widths[3]),
    pad(header[4], widths[4]),
  );
  for (const r of rows) {
    console.log(
      pad(r.path, widths[0]),
      pad(String(r.code || ''), widths[1]),
      pad(r.result, widths[2]),
      pad(r.body, widths[3]),
      pad(r.hint || '', widths[4]),
    );
  }

  const anyFail = rows.some(r => !String(r.result).startsWith('PASS'));
  if (anyFail) {
    console.log('\nRemediation hints:');
    console.log('- 404 root → add index.php with {"message":"QuickGig API"}');
    console.log('- 404 /health → add health.php with {"status":"ok"}');
    console.log('- 500 "could not find driver" → enable nd_pdo_mysql');
    console.log('- 500 "undefined function mysqli" → enable nd_mysqli');
    console.log('- 403/404 both → confirm docroot path is /home/u789476867/domains/quickgig.ph/public_html/api/');
  }

  if (anyFail && !SOFT) process.exit(1);
})();
