const base = (process.env.BASE || '').replace(/\/$/, '');
if (!base) { console.warn('No BASE provided; skipping root redirect check'); process.exit(0); }
(async () => {
  const r = await fetch(base + '/', { method: 'HEAD', redirect: 'manual' });
  if (![301,302,307,308].includes(r.status)) throw new Error(`HEAD / expected redirect, got ${r.status}`);
  const loc = r.headers.get('location') || '';
  if (!/^https:\/\/app\.quickgig\.ph(\/|$)/.test(loc)) throw new Error(`Redirect location not app.quickgig.ph: ${loc}`);
  console.log('Root redirect OK');
})();
