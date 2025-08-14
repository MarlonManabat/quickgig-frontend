const base = (process.env.BASE || '').replace(/\/$/, '');
if (!base) { console.warn('No BASE provided; skipping app check'); process.exit(0); }

const fetchImpl = globalThis.fetch;
const wait = (ms)=>new Promise(r=>setTimeout(r,ms));
async function get(u, o) {
  let last;
  for (let i = 0; i < 5; i++) {
    try { return await fetchImpl(u, { redirect: 'manual', ...o }); }
    catch (e) { last = e; await wait(1000 * (i + 1)); }
  }
  throw last || new Error('fetch failed');
}

(async () => {
  // HEAD /
  const head = await get(base + '/', { method: 'HEAD' });
  if (![301,302,307,308].includes(head.status)) throw new Error(`HEAD / expected redirect, got ${head.status}`);

  // GET /app
  const app = await get(base + '/app', { method: 'GET' });
  if (app.status < 200 || app.status >= 400) throw new Error(`GET /app expected 2xx/3xx; got ${app.status}`);

  console.log('App OK');
})();
