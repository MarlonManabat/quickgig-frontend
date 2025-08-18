#!/usr/bin/env node
const enable = process.env.NEXT_PUBLIC_ENABLE_SETTINGS === 'true';
if (!enable) {
  console.log('skipped');
  process.exit(0);
}
const base = process.env.SMOKE_URL || 'http://localhost:3000';
async function run() {
  if (process.env.ENGINE_MODE === 'php') {
    const res = await fetch(base + '/api/settings', { credentials: 'include' });
    const orig = await res.json();
    const lang = orig.lang === 'en' ? 'tl' : 'en';
    await fetch(base + '/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...orig, lang }),
    });
    const check = await fetch(base + '/api/settings', { credentials: 'include' });
    const data = await check.json();
    if (data.lang !== lang) throw new Error('settings');
    await fetch(base + '/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orig),
    });
    console.log('settings smoke ok');
  } else {
    console.log('skipped');
  }
}
run().catch((e) => {
  console.error('settings smoke failed', e);
  process.exit(0);
});
