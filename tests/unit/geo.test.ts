import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fetchRegions, withTimeout } from '../../lib/geo';

const realFetch = global.fetch;

test('withTimeout resolves', async () => {
  const v = await withTimeout(Promise.resolve(1), 100);
  assert.equal(v, 1);
});

test('withTimeout rejects on timeout', async () => {
  await assert.rejects(() => withTimeout(new Promise(() => {}), 100));
});

test('withTimeout clears timer', async () => {
  let cleared = false;
  const realClear = global.clearTimeout;
  global.clearTimeout = ((id: any) => {
    cleared = true;
    return realClear(id);
  }) as any;
  try {
    await withTimeout(Promise.resolve('ok'), 50);
    assert.ok(cleared);
  } finally {
    global.clearTimeout = realClear;
  }
});

test('fetchRegions supabase success', async () => {
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://sb';
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'k';
  let called = 0;
    global.fetch = (async (url: any) => {
      called++;
      if (String(url).startsWith('https://sb')) {
        return new Response(
          JSON.stringify([{ id: 'A', code: 'A', name: 'Region A' }]),
          { status: 200 }
        );
      }
      return new Response('[]', { status: 200 });
    }) as any;
  const regions = await fetchRegions();
  assert.equal(regions[0].name, 'Region A');
  assert.equal(called, 1);
});

test('fetchRegions falls back to api then static', async () => {
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://sb';
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'k';
  let call = 0;
  global.fetch = (async (url: any) => {
    call++;
    if (call === 1) throw new Error('sb fail');
    if (call === 2) throw new Error('api fail');
    if (String(url).includes('/geo/ph/regions.json')) {
      return new Response(
        JSON.stringify([
          { id: 'NCR', code: 'NCR', name: 'National Capital Region' },
        ]),
        { status: 200 },
      );
    }
    return new Response('[]', { status: 200 });
  }) as any;
  const regions = await fetchRegions();
  assert.equal(regions[0].id, 'NCR');
  assert.equal(call, 3);
});

test.after(() => {
  global.fetch = realFetch;
  delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
});
