const BASE = process.env.SMOKE_URL || process.env.BASE || 'http://localhost:3000';
(async () => {
  const urls = ['/.well-known/health', '/__health'];
  for (const p of urls) {
    try {
      const r = await fetch(BASE.replace(/\/+$/,'') + p);
      if (r.ok) { console.log('status', r.status); return; }
    } catch {}
  }
  console.log('status fail');
  process.exit(1);
})();
