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
  if (head.status < 200 || head.status >= 400) throw new Error(`HEAD / expected 2xx; got ${head.status}`);

  // HEAD /app should redirect to root
  const app = await get(base + '/app', { method: 'HEAD' });
  if (![301,302,307,308].includes(app.status)) throw new Error(`HEAD /app expected redirect; got ${app.status}`);
  const loc = app.headers.get('location') || '';
  if (loc !== '/' && loc !== base + '/') throw new Error(`Redirect location not root: ${loc}`);

  console.log('App OK');
})();
