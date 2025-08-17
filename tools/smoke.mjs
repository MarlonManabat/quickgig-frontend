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
  // Soft-check a guaranteed-404 path; do not fail build
  try {
    const url404 = BASE.replace(/\/+$/,'') + '/definitely-not-here-404';
    const r404 = await fetch(url404);
    console.log('404-check', r404.status);
  } catch (e) {
    console.log('404-check error', String(e));
  }
})();
