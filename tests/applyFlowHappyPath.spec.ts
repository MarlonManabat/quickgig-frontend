import { test, expect } from '@playwright/test';
import profile from './fixtures/profile.json';
import applySuccess from './fixtures/applySuccess.json';

const enabled = process.env.NEXT_PUBLIC_ENABLE_APPLY_FLOW_AUDIT === 'true';

test.skip(!enabled, 'Apply flow audit disabled');

test('happy path apply flow', async ({ page }) => {
  await page.route('**/applications/create.php', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(applySuccess),
    });
  });

  await page.goto('/jobs/1');
  await page.getByTestId('apply-button').click();
  const form = page.getByTestId('apply-form');
  await expect(form).toBeVisible();
  expect(await form.innerText()).toMatchSnapshot('apply-form.txt');

  await page.getByPlaceholder('Name').fill(profile.name);
  await page.getByPlaceholder('Email').fill(profile.email);
  await page.getByPlaceholder('Phone').fill(profile.phone);

  await page.getByRole('button', { name: 'Submit' }).click();

  const confirmation = page.getByTestId('apply-confirmation');
  await expect(confirmation).toBeVisible();
  expect(await confirmation.innerText()).toMatchSnapshot('apply-confirmation.txt');
});
