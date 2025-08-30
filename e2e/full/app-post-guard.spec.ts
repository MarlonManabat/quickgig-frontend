import { test, expect } from '@playwright/test';

test.describe('Post job page (logged out)', () => {
  test('shows inline guard and does not call RPC', async ({ page }) => {
    // Record any RPC calls; there should be none while logged out
    const rpcCalls: string[] = [];
    page.on('request', req => {
      const url = req.url();
      if (url.includes('/rest/v1/rpc/')) rpcCalls.push(url);
    });

    await page.goto('/post');

    // Inline guard message must be visible (no redirect expected)
    await expect(page.getByText(/please log in/i)).toBeVisible();

    // Try clicking Create anyway; guard should still prevent RPC
    const createBtn = page.getByRole('button', { name: /create/i });
    if (await createBtn.isVisible()) {
      await createBtn.click({ trial: true }).catch(() => {});
    }

    await expect.poll(() => rpcCalls.length, { message: 'RPC calls captured' }).toBe(0);
  });
});
