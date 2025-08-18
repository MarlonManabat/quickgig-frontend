import assert from 'node:assert';
import test from 'node:test';
import { makeUploadKey } from '../uploadKey';
import { validateFile } from '../uploadPolicy';

test('makeUploadKey formats', () => {
  const k = makeUploadKey('avatars', 'my pic.png');
  assert.match(k, /^uploads\/avatars\/.+-my-pic.png$/);
});

test('validateFile rejects big file', () => {
  const big = { type: 'image/png', size: 10 * 1024 * 1024 } as File; // 10MB
  const r = validateFile(big);
  assert.deepEqual(r, { ok: false, reason: 'too_big' });
});
