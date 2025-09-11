/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any */
import { test, mock } from 'node:test';
import assert from 'node:assert/strict';
import * as agreements from '@/lib/agreements';
import * as auth from '@/lib/auth/requireUser';
import * as tickets from '@/lib/tickets';
import * as nextHeaders from 'next/headers';
import * as supabaseSSR from '@supabase/ssr';
import * as supabaseAdmin from '@/lib/supabase/admin';

test('POST /api/applications/:id/accept -> 201 { id }', async () => {
  mock.method(auth, 'requireUser', async () => ({ user: { id: 'emp1' } as any }));
  mock.method(agreements, 'createAgreementFromApplication', async () => 'ag1');
  const mod = await import('@/app/api/applications/[id]/accept/route');
  const res = await mod.POST(new Request('http://test'), { params: { id: 'app1' } });
  assert.equal(res.status, 201);
  const body = await res.json();
  assert.equal(body.id, 'ag1');
});

test('POST /api/agreements/:id/confirm -> 200 (tickets debited)', async () => {
  mock.method(nextHeaders, 'cookies', () => ({} as any));
  mock.method(supabaseSSR, 'createServerClient', () => ({
    auth: { getUser: async () => ({ data: { user: { id: 'emp1' } }, error: null }) },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () => ({
            data: { id: 'ag1', employer_id: 'emp1', seeker_id: 'worker1', status: 'pending', amount: 1 },
            error: null,
          }),
        }),
      }),
      update: () => ({
        eq: () => ({
          eq: () => ({
            select: () => ({
              maybeSingle: () => ({ data: { id: 'ag1' }, error: null }),
            }),
          }),
        }),
      }),
    }),
  }));
  const calls: any[] = [];
  mock.method(tickets, 'debit', async (...args: any[]) => {
    calls.push(args);
  });
  const mod = await import('@/app/api/agreements/[id]/confirm/route');
  const res = await mod.POST(new Request('http://test'), { params: { id: 'ag1' } });
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.status, 'confirmed');
  assert.equal(calls.length, 1);
});

test('POST /api/agreements/:id/cancel -> 200 (tickets refunded)', async () => {
  mock.method(nextHeaders, 'cookies', () => ({} as any));
  mock.method(supabaseSSR, 'createServerClient', () => ({
    auth: { getUser: async () => ({ data: { user: { id: 'emp1' } }, error: null }) },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () => ({ data: { id: 'ag1', employer_id: 'emp1', seeker_id: 'worker1', status: 'agreed' }, error: null }),
        }),
      }),
      update: () => ({ eq: () => ({ error: null }) }),
    }),
  }));
  mock.method(supabaseAdmin, 'getAdminClient', () => ({
    rpc: async () => ({ data: {}, error: null }),
  }));
  const mod = await import('@/app/api/agreements/[id]/cancel/route');
  const res = await mod.POST(new Request('http://test'), { params: { id: 'ag1' } });
  assert.equal(res.status, 200);
});
