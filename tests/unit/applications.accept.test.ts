import { test, mock } from 'node:test';
import assert from 'node:assert/strict';
import { POST } from '@/app/api/applications/[id]/accept/route';
import * as auth from '@/lib/auth';
import * as supabase from '@/lib/supabase';
import * as agreements from '@/lib/agreements';

test('rejects when user is not employer', async () => {
  mock.method(auth, 'requireUser', async () => ({ id: 'emp2' }));
  mock.method(supabase, 'getClient', () => ({
    from: () => ({
      select: () => ({
        eq: () => ({
          eq: () => ({
            maybeSingle: async () => ({ data: null, error: null }),
          }),
        }),
      }),
    }),
  }) as any);
  const res = await POST(new Request('http://test'), { params: { id: 'app1' } } as any);
  assert.equal(res.status, 403);
});

test('creates agreement for owning employer', async () => {
  mock.method(auth, 'requireUser', async () => ({ id: 'emp1' }));
  mock.method(agreements, 'createAgreementFromApplication', async () => ({ id: 'ag1' } as any));
  mock.method(supabase, 'getClient', () => ({
    from: () => ({
      select: () => ({
        eq: () => ({
          eq: () => ({
            maybeSingle: async () => ({ data: { id: 'app1', employer_id: 'emp1' }, error: null }),
          }),
        }),
      }),
    }),
  }) as any);
  const res = await POST(new Request('http://test'), { params: { id: 'app1' } } as any);
  assert.equal(res.status, 201);
  assert.deepEqual(await res.json(), { id: 'ag1' });
});
