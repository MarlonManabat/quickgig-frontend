export type TestSession =
  | { isTest: true; user: { id: string; role: 'worker'|'employer'|'admin' } }
  | { isTest: false };

export function getTestSession(): TestSession {
  if (process.env.NODE_ENV === 'production') return { isTest: false };

  const { cookies } = require('next/headers') as typeof import('next/headers');
  const store = cookies() as any;
  const role = store.get('qa_role')?.value as 'worker'|'employer'|'admin'|undefined;
  const uid  = store.get('qa_uid')?.value;

  if (role && uid) {
    return { isTest: true, user: { id: uid, role } };
  }
  return { isTest: false };
}
