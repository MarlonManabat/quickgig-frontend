import assert from 'node:assert';

const base = process.env.BASE_URL;
const secret = process.env.QA_TEST_SECRET;

assert(base, 'BASE_URL is required');
assert(secret, 'QA_TEST_SECRET is required');

const res = await fetch(new URL('/api/test/seed', base).toString(), {
  method: 'POST',
  headers: { 'x-test-secret': secret },
});

if (!res.ok) {
  const text = await res.text();
  console.error('Seed failed:', res.status, text);
  process.exit(1);
}

const json = await res.json();
console.log('Seed ok:', json);
