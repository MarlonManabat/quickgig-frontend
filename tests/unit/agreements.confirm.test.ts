import { test, mock } from 'node:test';
import assert from 'node:assert/strict';
import * as tickets from '@/lib/tickets';
import * as nextHeaders from 'next/headers';
import * as supabaseSSR from '@supabase/ssr';
import { POST } from '@/app/api/agreements/[id]/confirm/route';

test('debits tickets only on first confirm', async () => {
  const debitSpy = mock.method(tickets, 'debit', async () => {});
  mock.method(nextHeaders, 'cookies', () => ({} as any));

  let first = true;
  mock.method(supabaseSSR, 'createServerClient', () => ({
    auth: { getUser: async () => ({ data: { user: { id: 'emp1' } }, error: null }) },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () => ({
            data: { id: 'ag1', employer_id: 'emp1', seeker_id: 'worker1', status: 'pending', amount: 10 },
            error: null,
          }),
        }),
      }),
      update: () => ({
        eq: () => ({
          eq: () => ({
            select: () => ({
              maybeSingle: async () => {
                if (first) {
                  first = false;
                  return { data: { id: 'ag1' }, error: null };
                }
                return { data: null, error: null };
              },
            }),
          }),
        }),
      }),
    }),
  }));

  const req = new Request('http://test');
  const res1 = await POST(req, { params: { id: 'ag1' } } as any);
  assert.equal((await res1.json()).status, 'confirmed');
  assert.equal(debitSpy.mock.callCount(), 1);

  const res2 = await POST(req, { params: { id: 'ag1' } } as any);
  assert.equal((await res2.json()).status, 'already-confirmed');
  assert.equal(debitSpy.mock.callCount(), 1);
});
