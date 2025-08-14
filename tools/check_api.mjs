import fs from 'fs';

const api = (process.env.API || 'https://api.quickgig.ph').replace(/\/$/, '');
fs.mkdirSync('reports', { recursive: true });

(async () => {
  const url = api + '/health.php';
  const r = await fetch(url, { method: 'GET' });
  const status = r.status;
  let body = {};
  try {
    body = await r.json();
  } catch (e) {
    throw new Error(`Invalid JSON from API (${status})`);
  }
  console.log(body);
  if (status !== 200 || body.status !== 'ok') {
    fs.writeFileSync('reports/api.json', JSON.stringify({ status: 'fail', code: status, body }));
    throw new Error(`API health check failed (${status})`);
  }
  fs.writeFileSync('reports/api.json', JSON.stringify({ status: 'ok', code: status, body }));
  console.log('API OK');
})();
