import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import Module from 'node:module';

process.env.NODE_PATH = path.resolve(__dirname, '__mocks__');
Module._initPaths();

async function call(body: any = {}) {
  return new Promise<{ status: number }>(async (resolve) => {
    const req = { method: 'POST', body } as any;
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
    } as any;
    const { default: handler } = await import('../../pages/api/agreements/finalize');
    handler(req, res);
  });
}

test('finalize agreement requires auth', async () => {
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://sb';
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'k';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'srv';
  process.env.NEXTAUTH_SECRET = 's';
  const r = await call({ agreementId: '00000000-0000-0000-0000-000000000000' });
  assert.equal(r.status, 401);
});

test.after(() => {
  delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  delete process.env.NEXTAUTH_SECRET;
});
