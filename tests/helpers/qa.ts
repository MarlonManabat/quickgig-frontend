import { request, APIRequestContext } from '@playwright/test'
export async function qaContext(): Promise<APIRequestContext> {
  const ctx = await request.newContext({
    extraHTTPHeaders: { 'x-qa-secret': process.env.QA_TEST_SECRET! },
    baseURL: process.env.BASE_URL || process.env.APP_URL,
  })
  return ctx
}
