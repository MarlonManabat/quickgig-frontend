export type TestSession =
  | { isTest: true; user: { id: string; role: 'worker'|'employer'|'admin' } }
  | { isTest: false };

export function getTestSession(): TestSession {
  if (process.env.VERCEL_ENV !== 'preview' && process.env.CI !== 'true') {
    return { isTest: false };
  }

  const { cookies } = require('next/headers') as typeof import('next/headers');
  const store = cookies() as any;
  const role = store.get('qg_test_role')?.value as 'worker'|'employer'|'admin'|undefined;
  const uid  = store.get('qg_test_uid')?.value;

  if (role && uid) {
    return { isTest: true, user: { id: uid, role } };
  }
  return { isTest: false };
}
