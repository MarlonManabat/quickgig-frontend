import { test } from '@playwright/test';

test.describe('payments and tickets', () => {
  test.skip(true, 'E2E payment flow requires full environment.');
});

