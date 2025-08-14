const base = process.env.BASE || 'http://localhost:3000';
const fetchImpl = globalThis.fetch;
const bail = (m)=>{ console.error(m); process.exit(1); };
(async () => {
  const r1 = await fetchImpl(base + '/', { method: 'HEAD', redirect: 'manual' });
  if (![301,302,307,308].includes(r1.status)) bail(`HEAD / expected redirect, got ${r1.status}`);
  const loc = r1.headers.get('location') || '';
  if (!loc.startsWith('/app')) bail(`HEAD / location must start with /app; got ${loc}`);
  const r2 = await fetchImpl(base + '/app', { method: 'GET', redirect: 'manual' });
  if (r2.status < 200 || r2.status >= 400) bail(`GET /app expected 2xx/3xx; got ${r2.status}`);
  console.log('Smoke OK');
})();
