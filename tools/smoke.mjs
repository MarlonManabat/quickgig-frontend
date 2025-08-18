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
  if (process.env.SMOKE_APPS === '1') {
    try {
      const r3 = await fetchImpl(base + '/api/applications');
      if (r3.ok) {
        const arr = await r3.json();
        console.log('applications', Array.isArray(arr) ? arr.length : 'n/a');
      } else {
        console.log('applications check skipped', r3.status);
      }
    } catch (e) {
      console.log('applications check skipped');
    }
  }
  console.log('Smoke OK');
})();
