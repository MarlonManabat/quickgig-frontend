export async function loginAs(page, role) {
  await page.request.post('/api/test/login', { data: { role } });
}

export async function seedBasic(page) {
  await page.request.post('/api/test/seed', { data: {} });
}
