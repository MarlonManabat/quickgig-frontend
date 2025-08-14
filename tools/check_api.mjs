const API_BASE = (process.env.API_BASE || 'https://api.quickgig.ph').replace(/\/$/, '');

(async () => {
  try {
    const res = await fetch(`${API_BASE}/health.php`);
    if (res.status !== 200) {
      throw new Error(`unexpected status ${res.status}`);
    }
    const body = await res.json().catch(() => ({}));
    if (body.status !== 'ok') {
      throw new Error(`unexpected body ${JSON.stringify(body)}`);
    }
    console.log('API ok', res.headers.get('server'), res.headers.get('date'));
    process.exit(0);
  } catch (err) {
    console.error('API check failed:', err.message);
    process.exit(1);
  }
})();
