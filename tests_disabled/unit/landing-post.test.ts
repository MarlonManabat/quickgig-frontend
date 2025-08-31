import { test, mock } from 'node:test';
import assert from 'node:assert/strict';

// Ensure submit uses create_gig_public RPC
test('submit calls create_gig_public', async () => {
  const rpcMock = mock.fn(async () => ({ data: { gig_id: '1' }, error: null }));
  const supa = {
    auth: { getUser: async () => ({ data: { user: { id: 'u1' } } }) },
    rpc: rpcMock,
  } as any;

  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.com';
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon';
  const { submit, __setSupabaseClient } = await import('../../pages/employer/post.tsx');
  __setSupabaseClient(supa);

  const fd = new FormData();
  fd.set('title', 't');
  fd.set('description', 'd');
  fd.set('region_code', 'r');
  fd.set('city_code', 'c');
  fd.set('price_php', '100');

  await submit(fd);

  assert.equal(rpcMock.mock.calls[0].arguments[0], 'create_gig_public');
});
