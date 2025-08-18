import test from 'node:test';
import assert from 'node:assert';
import { limit } from '../src/server/rateLimit';

test('allows within limit', () => {
  const key = 'a';
  const windowMs = 1000;
  const max = 2;
  const r1 = limit({ key, windowMs, max });
  const r2 = limit({ key, windowMs, max });
  assert.ok(r1.ok);
  assert.ok(r2.ok);
});

test('blocks when exceeded', () => {
  const key = 'b';
  const windowMs = 1000;
  const max = 1;
  limit({ key, windowMs, max });
  const r2 = limit({ key, windowMs, max });
  assert.equal(r2.ok, false);
  assert.ok(r2.retryAfterSeconds > 0);
});
