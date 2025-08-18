const base = process.env.BASE || 'http://localhost:3000';
const fetchImpl = globalThis.fetch;
const bail = (m)=>{ console.error(m); process.exit(1); };
(async () => {
  const r1 = await fetchImpl(base + '/', { method: 'HEAD', redirect: 'manual' });
  if (r1.status < 200 || r1.status >= 400) bail(`HEAD / expected 2xx; got ${r1.status}`);
  if (r1.headers.get('location')) bail('HEAD / should not redirect');
  const r2 = await fetchImpl(base + '/app', { method: 'HEAD', redirect: 'manual' });
  if (![301,302,307,308].includes(r2.status)) bail(`HEAD /app expected redirect; got ${r2.status}`);
  const loc = r2.headers.get('location') || '';
  if (loc !== '/' && loc !== base + '/') bail(`HEAD /app location must be root; got ${loc}`);
  console.log('Smoke OK');
})();
