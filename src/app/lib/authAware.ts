export function loginNext(dest: string) {
  return `/login?next=${encodeURIComponent(dest)}`;
}
