const WINDOW_MS = 10 * 60 * 1000; // 10 min
const LIMIT = 20;

const store = new Map<string, { count: number; start: number }>();

export function hit(key: string, limit = LIMIT, windowMs = WINDOW_MS): boolean {
  const now = Date.now();
  const rec = store.get(key);
  if (!rec || now - rec.start > windowMs) {
    store.set(key, { count: 1, start: now });
    return true;
  }
  if (rec.count >= limit) return false;
  rec.count += 1;
  return true;
}

export function reset() {
  store.clear();
}
