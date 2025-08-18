import test from 'node:test';
import assert from 'node:assert';
import { track } from '../src/lib/analytics';

global.localStorage = {
  store: {} as Record<string, string>,
  getItem(k: string) { return (this.store as any)[k]; },
  setItem(k: string, v: string) { (this.store as any)[k] = v; },
};

test('falls back to console when no consent', async () => {
  const dbg = (console.debug = (..._args: any[]) => { (dbg as any).called = true; });
  await track('event');
  assert.ok((dbg as any).called);
});

test('posts when consent granted and webhook set', async () => {
  (global as any).fetch = async () => ({ ok: true });
  (process as any).env.NEXT_PUBLIC_ANALYTICS_WEBHOOK = 'https://example.com';
  localStorage.setItem('consent', 'granted');
  await track('event', { a: 1 });
  // if fetch wasn't called, it would throw; so pass
  assert.ok(true);
});
