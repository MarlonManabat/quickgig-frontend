const base = process.env.BASE_URL || 'http://127.0.0.1:3000';
const email = process.env.VERIFY_EMAIL;
const password = process.env.VERIFY_PASSWORD;

if (!email || !password) {
  console.error('VERIFY_EMAIL and VERIFY_PASSWORD required');
  process.exit(1);
}

const loginRes = await fetch(`${base}/api/session/login`, {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ email, password }),
  redirect: 'manual',
});

if (!loginRes.ok) {
  console.error('login failed', loginRes.status);
  process.exit(1);
}

const cookie = loginRes.headers.get('set-cookie');
if (!cookie) {
  console.error('no cookie set');
  process.exit(1);
}

const meRes = await fetch(`${base}/api/session/me`, {
  headers: { cookie },
});

if (!meRes.ok) {
  console.error('me failed', meRes.status);
  process.exit(1);
}

const out = await meRes.text();
console.log(out);
