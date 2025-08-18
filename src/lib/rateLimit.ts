const hits = new Map<string,{n:number,t:number}>();
const now = () => Date.now();
export function allow(key: string, max = 60, windowMs = 60_000) {
  const k = key;
  const r = hits.get(k) ?? { n: 0, t: now() };
  const elapsed = now() - r.t;
  if (elapsed > windowMs) { r.n = 0; r.t = now(); }
  r.n += 1; hits.set(k, r);
  return r.n <= max;
}
