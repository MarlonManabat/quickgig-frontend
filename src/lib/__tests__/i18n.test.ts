import test from 'node:test';
import assert from 'node:assert';
import { t } from '../t';

test('interpolates variables', () => {
  const s = t('search_results_count', { total: 5 });
  assert.ok(/5/.test(s));
});
