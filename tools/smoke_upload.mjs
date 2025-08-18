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
      body: JSON.stringify({ key: 'uploads/test.txt', type: 'text/plain' })
    });
    const j = await u.json().catch(() => ({}));
    console.log('upload', u.status, j?.url ? 'ok' : 'no url');
  } catch (e) {
    console.log('upload error', String(e));
  }
})();
