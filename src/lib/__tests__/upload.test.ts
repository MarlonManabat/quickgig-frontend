import assert from 'node:assert';
import test from 'node:test';
import { makeUploadKey } from '../../server/uploads/makeUploadKey';
import { validateFile } from '../uploadPolicy';

test('makeUploadKey formats', () => {
  const k = makeUploadKey(null, 'my pic.png');
  assert.match(k, /^uploads\/[0-9]{4}\/[0-9]{2}\/[0-9]{2}\/anon\/.+\.png$/);
});

test('validateFile rejects big file', () => {
  const big = { type: 'image/png', size: 10 * 1024 * 1024 } as File; // 10MB
  const r = validateFile(big);
  assert.deepEqual(r, { ok: false, reason: 'too_big' });
});
