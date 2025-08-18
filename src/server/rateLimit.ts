const buckets = new Map<string, { tokens: number; last: number }>();

export function limit({ key, max, windowMs }: { key: string; max: number; windowMs: number }) {
  const now = Date.now();
  const bucket = buckets.get(key) || { tokens: max, last: now };
  const elapsed = now - bucket.last;
  bucket.tokens = Math.min(max, bucket.tokens + (elapsed / windowMs) * max);
  bucket.last = now;
  if (bucket.tokens >= 1) {
    bucket.tokens -= 1;
    buckets.set(key, bucket);
    return { ok: true, retryAfterSeconds: 0 };
  }
  const retryAfterSeconds = Math.ceil(((1 - bucket.tokens) * windowMs) / max / 1000);
  buckets.set(key, bucket);
  return { ok: false, retryAfterSeconds };
}
