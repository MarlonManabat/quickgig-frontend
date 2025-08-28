import { test } from '@playwright/test';
test.setTimeout(10*60*1000);
test('clickmap', async () => { await import('../scripts/qa/clickmap'); });
