const BASE = process.env.SMOKE_URL || process.env.BASE || 'http://localhost:3000';
(async () => {
  if (process.env.NEXT_PUBLIC_ENABLE_S3_UPLOADS !== 'true') {
    console.log('upload: skipped (flag off)');
    return;
  }
  try {
    const u = await fetch(`${BASE.replace(/\/+$/,'')}/api/upload`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: 'smoke.txt', type: 'text/plain', size: 2 })
    });
    const j = await u.json().catch(() => ({}));
    if (!u.ok || !j?.url) {
      console.log('upload presign fail', u.status);
      return;
    }
    await fetch(j.url, { method: 'PUT', headers: { 'content-type': 'text/plain' }, body: 'ok' });
    console.log('upload', u.status, 'put ok');
  } catch (e) {
    console.log('upload error', String(e));
  }
})();
