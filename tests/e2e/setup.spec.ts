import { test } from '@playwright/test';
import { seedBasic } from './_helpers/session';
test.describe.configure({ mode: 'serial' });
test('seed', async ({ request }) => { await seedBasic(request); });
