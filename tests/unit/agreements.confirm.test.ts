import { test, mock } from 'node:test';
import assert from 'node:assert/strict';
import { POST } from '@/app/api/agreements/[id]/confirm/route';
import * as auth from '@/lib/auth';
import * as supabase from '@/lib/supabase';

test('debits tickets only on first confirm', async () => {
  mock.method(auth, 'requireUser', async () => ({ id: 'emp1' }));

  let status = 'pending';
  const rpc = mock.fn(async () => ({ error: null }));
  const admin = {
    from: () => ({
      select: () => ({
        eq: () => ({
          maybeSingle: async () => ({
            data: { id: 'ag1', status, employer_id: 'emp1', amount: 10 },
            error: null,
          }),
        }),
      }),
      update: () => ({
        eq: () => ({
          eq: () => {
            status = 'agreed';
            return { error: null };
          },
        }),
      }),
    }),
    rpc,
  } as any;
  mock.method(supabase, 'getAdminClient', async () => admin);

  const req = new Request('http://test', { method: 'POST' });
  let res = await POST(req, { params: { id: 'ag1' } } as any);
  assert.deepEqual(await res.json(), { ok: true, id: 'ag1' });
  assert.equal(rpc.mock.callCount(), 1);

  res = await POST(req, { params: { id: 'ag1' } } as any);
  assert.deepEqual(await res.json(), { ok: true, alreadyConfirmed: true });
  assert.equal(rpc.mock.callCount(), 1);
});
