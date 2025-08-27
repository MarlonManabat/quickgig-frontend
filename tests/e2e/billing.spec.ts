import { test, expect } from '@playwright/test';
import { loginAs } from './_helpers/session';

const app = process.env.PLAYWRIGHT_APP_URL!;
const supa = process.env.NEXT_PUBLIC_SUPABASE_URL!;

test('@full manual gcash flow', async ({ page }) => {
  let employerCredits = 0;
  const proofs: any[] = [];

  await page.route(`${supa}/rest/v1/user_credits*`, (route) => {
    if (route.request().method() === 'GET') {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ credits: employerCredits }),
      });
    }
  });
  await page.route(`${supa}/rest/v1/rpc/grant_credits`, (route) => {
    const body = JSON.parse(route.request().postData() || '{}');
    employerCredits += body.p_delta || 0;
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(employerCredits),
    });
  });
  await page.route(`${supa}/rest/v1/payment_proofs*`, (route) => {
    const method = route.request().method();
    if (method === 'POST') {
      const body = JSON.parse(route.request().postData() || '{}');
      const proof = {
        id: 'proof1',
        created_at: new Date().toISOString(),
        status: 'pending',
        ...body,
      };
      proofs.push(proof);
      route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify([proof]),
      });
    } else if (method === 'GET') {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(proofs.filter((p) => !route.request().url().includes('status=eq.') || p.status === 'pending')),
      });
    } else if (method === 'PATCH') {
      const url = new URL(route.request().url());
      const id = url.searchParams.get('id')?.replace('eq.', '') || '';
      const body = JSON.parse(route.request().postData() || '{}');
      const idx = proofs.findIndex((p) => p.id === id);
      proofs[idx] = { ...proofs[idx], ...body };
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([proofs[idx]]),
      });
    }
  });
  await page.route(`${supa}/storage/v1/object/gcash-proofs/*`, (route) => {
    route.fulfill({ status: 200, body: '' });
  });

  await loginAs(page, 'employer');
  await page.goto(`${app}/billing/manual-gcash`);
  await page.fill('input[type=number]', '100');
  await page.setInputFiles('input[type=file]', 'public/logo-icon.png');
  await page.click('button[type=submit]');
  await expect(page.getByText('Submitted for review')).toBeVisible();
  await page.click('text=View history');
  await expect(page.getByText('pending')).toBeVisible();

  await loginAs(page, 'admin');
  await page.goto(`${app}/admin/billing`);
  await page.click('text=Approve');
  await expect(page.getByText('No proofs')).toBeVisible();

  await loginAs(page, 'employer');
  await page.goto(app);
  await expect(page.getByTestId('credits-pill')).toHaveText('Credits: 1');
});
