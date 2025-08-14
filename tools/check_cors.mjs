import fs from 'fs';

const url = 'https://api.quickgig.ph/health.php';
const origin = 'https://quickgig.ph';
fs.mkdirSync('reports', { recursive: true });

(async () => {
  const pre = await fetch(url, {
    method: 'OPTIONS',
    headers: {
      Origin: origin,
      'Access-Control-Request-Method': 'GET',
      'Access-Control-Request-Headers': 'Content-Type'
    }
  });
  const allowOrigin = pre.headers.get('access-control-allow-origin');
  const allowCreds = pre.headers.get('access-control-allow-credentials');
  if (pre.status !== 200 || !allowOrigin ||
      ![origin, 'https://app.quickgig.ph'].includes(allowOrigin) ||
      allowCreds !== 'true') {
    fs.writeFileSync('reports/cors.json', JSON.stringify({ status: 'fail', code: pre.status, allowOrigin, allowCreds }));
    throw new Error('CORS preflight failed');
  }
  const res = await fetch(url, {
    headers: { Origin: origin },
    credentials: 'include'
  });
  if (res.status !== 200) {
    fs.writeFileSync('reports/cors.json', JSON.stringify({ status: 'fail', code: res.status }));
    throw new Error(`CORS fetch failed ${res.status}`);
  }
  fs.writeFileSync('reports/cors.json', JSON.stringify({ status: 'ok' }));
  console.log('CORS OK');
})();
