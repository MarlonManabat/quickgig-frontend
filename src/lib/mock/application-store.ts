import 'server-only';

export type MockApplication = {
  id: string;
  candidateId: string;
  gigId: string;
  status: 'applied' | 'withdrawn';
};

export class MockNotFoundError extends Error {}
export class MockForbiddenError extends Error {}

const store = new Map<string, MockApplication>();
let logged = false;

function logOnce() {
  if (!logged) {
    console.log('[applications] using mock store');
    logged = true;
  }
}

export function mockWithdraw(uid: string, id: string): void {
  logOnce();
  const app = store.get(id);
  if (!app) throw new MockNotFoundError('not found');
  if (app.candidateId !== uid) throw new MockForbiddenError('forbidden');
  app.status = 'withdrawn';
}

export { store as mockApplicationStore };
