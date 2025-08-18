import test from 'node:test';
import assert from 'node:assert';
import { bundles } from '../src/lib/t';

const keys = ['rate_limited', 'consent.ask', 'consent.yes', 'consent.no', 'privacy.title', 'terms.title'];

test('include new keys', () => {
  for (const k of keys) {
    assert.equal(typeof bundles.english[k], 'string');
    assert.equal(typeof bundles.taglish[k], 'string');
  }
});
