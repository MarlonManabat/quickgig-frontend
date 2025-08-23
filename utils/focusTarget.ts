export function focusFromQuery(param: string, map: Record<string, string>) {
  if (typeof window === 'undefined') return;
  const u = new URL(window.location.href);
  const key = u.searchParams.get(param) ?? '';
  const selector = map[key];
  if (selector) requestAnimationFrame(() => {
    const el = document.querySelector<HTMLElement>(selector);
    el?.focus();
  });
}
