const api = (process.env.API || 'https://api.quickgig.ph').replace(/\/$/, '');
const pageOrigin = (process.env.PAGE_ORIGIN || 'https://quickgig.ph');

(async () => {
  const r = await fetch(api + '/health.php', { method: 'GET' });
  if (!r.ok) throw new Error(`API health ${r.status}`);
  // If server includes CORS on GET, ensure it's sane (some hosts only add it on actual CORS requests; tolerate absence)
  const allowOrigin = r.headers.get('access-control-allow-origin');
  if (allowOrigin && allowOrigin !== pageOrigin) {
    throw new Error(`CORS allow-origin mismatch: got "${allowOrigin}" expected "${pageOrigin}"`);
  }
  console.log('API OK');
})();
