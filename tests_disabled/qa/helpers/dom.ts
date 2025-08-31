import { waitForAppReady, noConsoleErrors } from './waits';

export async function clickAllInteractivesOn(page, within='main') {
  const scope = page.locator(within);
  const clickables = scope
    .locator('a,button,[role=button],[data-testid*=btn]')
    .filter({ hasNot: page.locator('[aria-disabled=true],:disabled') });
  const count = await clickables.count();
  for (let i = 0; i < count; i++) {
    const el = clickables.nth(i);
    const href = await el.getAttribute('href');
    const stopper = await noConsoleErrors(page);
    await Promise.race([
      el.click({ force: false, trial: false }),
      page.waitForLoadState('load').catch(() => {}),
    ]);
    await waitForAppReady(page);
    stopper();
    if (href) {
      await page.goBack().catch(() => {});
      await waitForAppReady(page);
    }
  }
}
