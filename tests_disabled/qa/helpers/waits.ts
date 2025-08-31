export async function waitForAppReady(page) {
  // be tolerant: header OR main must appear and we should not be stuck on a skeleton
  await page.waitForSelector('[data-testid="app-header"], main', {
    state: 'visible',
    timeout: 15_000,
  });
  await page.waitForLoadState('networkidle', { timeout: 10_000 }).catch(() => {});
}

export async function noConsoleErrors(page) {
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  return () => {
    expect(errors, 'No console errors').toEqual([]);
  };
}
