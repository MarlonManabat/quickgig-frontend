import https from 'node:https';

const checks = [
  { url: 'https://quickgig.ph/',        expect: 308, must: 'https://app.quickgig.ph/' },
  { url: 'https://www.quickgig.ph/',    expect: 308, must: 'https://app.quickgig.ph/' },
  { url: 'https://app.quickgig.ph/',    expect: 200 },
];

function head(url) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, { method: 'HEAD' }, res => {
      resolve({ status: res.statusCode, location: res.headers.location || '' });
    });
    req.on('error', reject);
    req.end();
  });
}

let failed = 0;
(async () => {
  for (const c of checks) {
    try {
      const r = await head(c.url);
      const okStatus = r.status === c.expect;
      const okLoc = c.must ? r.location && r.location.startsWith(c.must) : true;
      if (okStatus && okLoc) {
        console.log('OK  ', c.url, '->', r.status, r.location || '');
      } else {
        failed++;
        console.error('FAIL', c.url, 'got', r.status, r.location || '');
      }
    } catch (e) {
      failed++;
      console.error('ERR ', c.url, e?.message || e);
    }
  }
  if (failed) process.exit(1);
})();
