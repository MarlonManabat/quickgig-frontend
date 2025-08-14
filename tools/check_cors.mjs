const API_BASE = (process.env.API_BASE || 'https://api.quickgig.ph').replace(/\/$/, '');
const ORIGIN = 'https://quickgig.ph';

(async () => {
  try {
    const res = await fetch(`${API_BASE}/health.php`, {
      method: 'OPTIONS',
      headers: {
        Origin: ORIGIN,
        'Access-Control-Request-Method': 'GET',
      },
    });
    if (![200,204].includes(res.status)) {
      throw new Error(`unexpected status ${res.status}`);
    }
    const allowOrigin = res.headers.get('access-control-allow-origin');
    if (!allowOrigin) {
      throw new Error('missing access-control-allow-origin');
    }
    console.log('CORS ok', allowOrigin, res.headers.get('access-control-allow-credentials'));
    process.exit(0);
  } catch (err) {
    console.error('CORS check failed:', err.message);
    process.exit(1);
  }
})();
