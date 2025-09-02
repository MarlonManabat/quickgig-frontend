import { test, expect } from '@playwright/test';

const PREVIEW_URL = process.env.PREVIEW_URL;

test.skip(!PREVIEW_URL, 'PREVIEW_URL not set');

test('preview home responds', async ({ request }) => {
  const res = await request.get(PREVIEW_URL!);
  expect(res.status()).toBeLessThan(400);
});
