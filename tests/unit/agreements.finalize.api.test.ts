import test from 'node:test';
import assert from 'node:assert/strict';

async function call(body: any = {}) {
  return new Promise<{ status: number }>(async (resolve) => {
    const req = {
      method: 'POST',
      body,
      cookies: {},
      headers: {},
    } as any;
    const res = {
      status(code: number) {
        this.statusCode = code;
        return this;
      },
      json() {
        resolve({ status: this.statusCode });
      },
      end() {
        resolve({ status: this.statusCode });
      },
      cookies: { set: () => {} },
      getHeader: () => undefined,
      setHeader: () => {},
    } as any;
    const prevFetch = global.fetch;
    global.fetch = async () => ({ ok: false, json: async () => ({}) }) as any;
    const { default: handler } = await import('../../pages/api/agreements/finalize');
    try {
      await handler(req, res);
    } catch (_) {
      // ignore
    } finally {
      global.fetch = prevFetch;
    }
  });
}

test('finalize agreement requires auth', async () => {
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://sb';
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'k';
  const r = await call({ agreementId: '00000000-0000-0000-0000-000000000000' });
  assert.equal(r.status, 401);
});

test.after(() => {
  delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
});
