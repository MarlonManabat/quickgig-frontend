/* Minimal smoke: fetch a few known pages after deploy if SMOKE_URL is set */
import { setTimeout as sleep } from 'timers/promises';
const BASE = process.env.SMOKE_URL || process.env.BASE || '';
if (!BASE) { console.log('No SMOKE_URL set; skipping smoke'); process.exit(0); }
const PATHS = ['/', '/find-work', '/login',
  ...(process.env.SMOKE_JOB_ID ? [`/jobs/${process.env.SMOKE_JOB_ID}`, `/jobs/${process.env.SMOKE_JOB_ID}/apply`] : [])
];
const fetchJson = async (url) => {
  const r = await fetch(url, { headers:{ 'accept':'text/html' }});
  if (!r.ok) throw new Error(`${r.status} ${url}`);
};
(async () => {
  for (const p of PATHS) {
    const url = BASE.replace(/\/+$/,'') + p;
    try { await fetchJson(url); console.log('OK', url); }
    catch (e) { console.log('WARN', String(e)); }
    await sleep(250);
  }
  // Hit a filter query (non-blocking)
  try {
    const rQ = await fetch(`${BASE}/find-work?q=demo`);
    console.log('find-work?q demo', rQ.status);
  } catch (e) { console.log('find-work?q error', String(e)); }
  try {
    const rS = await fetch(`${BASE}/saved`);
    console.log('saved page', rS.status);
  } catch (e) { console.log('saved page error', String(e)); }

  if (process.env.SMOKE_POST_JOB === '1') {
    try {
      const rP = await fetch(`${BASE}/employer/post`);
      console.log('post-job page', rP.status);
    } catch (e) { console.log('post-job page error', String(e)); }
  }
  // Soft-check a guaranteed-404 path; do not fail build
  try {
    const url404 = BASE.replace(/\/+$/,'') + '/definitely-not-here-404';
    const r404 = await fetch(url404);
    console.log('404-check', r404.status);
  } catch (e) {
    console.log('404-check error', String(e));
  }

  // Optional locale smoke checks
  const check = async (path, re, label) => {
    try {
      const r = await fetch(BASE.replace(/\/+$/,'') + path);
      const txt = await r.text();
      if (re.test(txt)) console.log('\u2705', label);
      else console.log('\u26a0\ufe0f', label, 'missing');
    } catch (e) {
      console.log('\u26a0\ufe0f', label, String(e));
    }
  };
  await check('/?lang=tl', /Hanap|Trabaho|Mag-apply/i, 'home tl');
  await check('/find-work?lang=tl&q=zzzzzz', /Wala pang resulta/i, 'find-work tl empty');
  await check('/saved?lang=en', /Saved jobs/i, 'saved en');
})();
