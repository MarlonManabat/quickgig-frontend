const base = (process.env.BASE || '').replace(/\/$/, '');
if (!base) { console.warn('No BASE provided; skipping root check'); process.exit(0); }
(async () => {
  const r = await fetch(base + '/', { method: 'HEAD', redirect: 'manual' });
  if (r.status < 200 || r.status >= 400) throw new Error(`HEAD / expected 2xx; got ${r.status}`);
  if (r.headers.get('location')) throw new Error('Root should not redirect');
  console.log('Root serving app directly (no redirect)');
})();
