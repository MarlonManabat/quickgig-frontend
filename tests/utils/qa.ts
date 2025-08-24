import { request } from '@playwright/test';
import { APP_URL } from '../helpers/env';

const QA_HEADER = process.env.QA_TEST_SECRET || '';

async function ctx() {
  return request.newContext({
    baseURL: APP_URL,
    extraHTTPHeaders: QA_HEADER ? { 'x-qa-secret': QA_HEADER } : {},
  });
}

export async function qaUpsertUser(
  email: string,
  role: 'employer' | 'worker',
  opts: { tickets?: number } = {}
) {
  const c = await ctx();
  const r = await c.post('/api/qa/users/upsert', { data: { email, role, ...opts } });
  const json = await r.json();
  return json;
}

export async function qaGrantTickets(email: string, amount: number) {
  const c = await ctx();
  const r = await c.post('/api/qa/tickets/grant', { data: { email, amount } });
  const json = await r.json();
  return json.balance as number;
}

export async function qaGetTickets(email: string) {
  const c = await ctx();
  const r = await c.get(`/api/qa/tickets/get?email=${encodeURIComponent(email)}`);
  const json = await r.json();
  return json.balance as number;
}

export async function qaCleanupJobs(opts: { titlePrefix: string }) {
  const c = await ctx();
  await c.post('/api/qa/cleanup/jobs', { data: opts });
}
