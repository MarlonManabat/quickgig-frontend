import test from 'node:test';
import assert from 'node:assert';
import { hit, reset } from '../rateLimiter';

test('rate limiter caps requests', () => {
  reset();
  for (let i = 0; i < 20; i++) {
    assert.equal(hit('a'), true);
  }
  assert.equal(hit('a'), false);
});
