export function getString(v?: string | string[]) {
  return Array.isArray(v) ? v[0] : v;
}
