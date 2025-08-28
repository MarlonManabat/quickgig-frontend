import { test } from 'node:test';
import assert from 'node:assert/strict';

const realFetch = global.fetch;

function call(handler: any, query: any) {
  return new Promise((resolve) => {
    const req = { query } as any;
    const res = {
      setHeader() {},
      status() { return this; },
      json(data: any) { resolve(data); },
    } as any;
    handler(req, res);
  });
}

test('regions API returns data', async () => {
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://sb';
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'k';
  global.fetch = (async (url: any) => {
    if (String(url).includes('/ph_regions')) {
      return new Response(
        JSON.stringify([{ code: '130000000', name: 'NCR' }]),
        { status: 200 },
      );
    }
    return new Response('[]', { status: 200 });
  }) as any;
  const mod = await import('../../pages/api/locations/regions');
  const data: any = await call(mod.default, {});
  assert.ok(Array.isArray(data));
  assert.ok(data.length > 0);
});

test('NCR cities include Quezon City and Taguig', async () => {
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://sb';
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'k';
  global.fetch = (async (url: any) => {
    if (String(url).includes('/ph_cities')) {
      return new Response(
        JSON.stringify([
          { code: '137402000', name: 'Quezon City' },
          { code: '137607000', name: 'Taguig' },
        ]),
        { status: 200 },
      );
    }
    return new Response('[]', { status: 200 });
  }) as any;
  const mod = await import('../../pages/api/locations/cities');
  const data: any = await call(mod.default, { region_id: '130000000' });
  const names = data.map((c: any) => c.name);
  assert.ok(names.includes('Quezon City'));
  assert.ok(names.includes('Taguig'));
});

test.after(() => {
  global.fetch = realFetch;
  delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
});
