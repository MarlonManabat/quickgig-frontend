import { test, mock } from 'node:test';
import assert from 'node:assert/strict';
import { POST } from '@/app/api/applications/[id]/accept/route';
import * as auth from '@/lib/auth';
import * as supabase from '@/lib/supabase';

test('rejects when user is not employer', async () => {
  mock.method(auth, 'requireUser', async () => ({ id: 'emp2' }));
  const admin = {
    from: () => ({
      select: () => ({
        eq: () => ({
          maybeSingle: async () => ({ data: { id: 'app1', employer_id: 'emp1' }, error: null }),
        }),
      }),
    }),
  } as any;
  mock.method(supabase, 'getAdminClient', async () => admin);
  const res = await POST(new Request('http://test'), { params: { id: 'app1' } } as any);
  assert.equal(res.status, 403);
});

test('creates agreement for owning employer', async () => {
  mock.method(auth, 'requireUser', async () => ({ id: 'emp1' }));
  const admin = {
    from: (table: string) => ({
      select: () => ({
        eq: () => ({
          maybeSingle: async () =>
            table === 'applications'
              ? { data: { id: 'app1', employer_id: 'emp1', seeker_id: 's1', amount: 5 }, error: null }
              : { data: { id: 'ag1' }, error: null },
        }),
      }),
      insert: (row: any) => ({
        select: () => ({ maybeSingle: async () => ({ data: { id: 'ag1' }, error: null }) }),
      }),
    }),
  } as any;
  mock.method(supabase, 'getAdminClient', async () => admin);
  const res = await POST(new Request('http://test'), { params: { id: 'app1' } } as any);
  assert.equal(res.status, 201);
  assert.deepEqual(await res.json(), { id: 'ag1' });
});
