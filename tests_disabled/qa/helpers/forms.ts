export async function smartFill(page, rootSel='form') {
  const form = page.locator(rootSel);
  // inputs
  const inputs = form.locator('input:not([type=hidden]):not([disabled])');
  const textareas = form.locator('textarea');
  const selects = form.locator('select, [role="combobox"]');
  // Use deterministic fake data; do not hit external services
  await inputs
    .filter({ hasNot: page.locator('[type=checkbox],[type=radio],[type=file]') })
    .evaluateAll(nodes =>
      nodes.forEach(n => ((n as HTMLInputElement).value = 'Test Value'))
    );
  await page.getByTestId('title').fill('Test Job').catch(() => {});
  await page
    .getByTestId('description')
    .fill('This is a long description for testing.')
    .catch(() => {});
  await page
    .getByTestId('select-region')
    .selectOption({ label: 'NCR' })
    .catch(async () => {
      const r = form.getByRole('combobox').first();
      await r.selectOption({ label: 'NCR' }).catch(() => {});
    });
  await page
    .getByTestId('select-province')
    .selectOption({ label: 'NCR' })
    .catch(() => {});
  await page
    .getByTestId('select-city')
    .selectOption({ label: 'Manila' })
    .catch(() => {});
}
