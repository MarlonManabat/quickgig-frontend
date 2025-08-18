#!/usr/bin/env node
const base = process.env.SMOKE_URL || process.env.BASE || 'http://localhost:3000';

async function main() {
  if (
    process.env.ENGINE_MODE !== 'php' ||
    !process.env.ENGINE_SMOKE_USER ||
    !process.env.ENGINE_SMOKE_PASS
  ) {
    console.log('engine auth skipped');
    return;
  }
  const creds = {
    email: process.env.ENGINE_SMOKE_USER,
    password: process.env.ENGINE_SMOKE_PASS,
  };
  const login = await fetch(base + '/api/session/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(creds),
    redirect: 'manual',
  });
  const cookie = login.headers.get('set-cookie');
  console.log('[engine-auth] login', login.status, Boolean(cookie));
  if (login.status !== 200 || !cookie) throw new Error('login failed');

  const headers = { cookie: cookie.split(';')[0] };
  const health = await fetch(base + '/api/engine/health', { headers });
  console.log('[engine-auth] health', health.status);
  if (!health.ok) throw new Error('health failed');

  const profile = await fetch(base + '/api/account/profile', { headers });
  console.log('[engine-auth] profile', profile.status);
  if (![200, 401].includes(profile.status)) throw new Error('profile failed');

  const logout = await fetch(base + '/api/session/logout', {
    method: 'POST',
    headers,
  });
  console.log('[engine-auth] logout', logout.status);
  if (!logout.ok) throw new Error('logout failed');
}

main().catch((err) => {
  console.error('engine auth smoke failed', err);
  process.exit(1);
});
