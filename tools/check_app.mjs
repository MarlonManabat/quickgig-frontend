const BASE = (process.env.BASE || 'https://app.quickgig.ph').replace(/\/$/, '');

(async () => {
  try {
    const res = await fetch(`${BASE}/`);
    const text = await res.text();
    if (res.status !== 200) {
      throw new Error(`unexpected status ${res.status}`);
    }
    if (!/QuickGig\.ph/i.test(text)) {
      throw new Error('missing QuickGig text');
    }
    if (/404\s+not\s+found/i.test(text)) {
      throw new Error('received 404 page');
    }
    console.log('App ok');
    process.exit(0);
  } catch (err) {
    console.error('App check failed:', err.message);
    process.exit(1);
  }
})();
