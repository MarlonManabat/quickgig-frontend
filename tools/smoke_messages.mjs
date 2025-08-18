const BASE = process.env.SMOKE_URL || process.env.BASE || 'http://localhost:3000';
(async () => {
  if (process.env.NEXT_PUBLIC_ENABLE_MESSAGES !== 'true') {
    console.log('messages: skipped (flag off)');
    return;
  }
  try {
    const ctrl = new AbortController();
    const r = await fetch(`${BASE.replace(/\/+$/,'')}/api/messages/events`, {
      headers: { cookie: 'auth_token=applicant:test@example.com' },
      signal: ctrl.signal,
    });
    const reader = r.body.getReader();
    const dec = new TextDecoder();
    let buf = '';
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buf += dec.decode(value);
      if (buf.includes('ready')) { console.log('messages: ok'); ctrl.abort(); return; }
      if (buf.length > 10000) break;
    }
    console.log('messages: no ready');
    process.exit(1);
  } catch (e) {
    console.log('messages error', String(e));
    process.exit(1);
  }
})();
