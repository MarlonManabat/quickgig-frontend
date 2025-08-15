export function getSessionId() {
  if (typeof document === 'undefined') return '';
  const KEY = 'quickgig_sid';
  let sid = localStorage.getItem(KEY);
  if (!sid) {
    sid =
      (crypto?.randomUUID?.() || String(Date.now()) + Math.random().toString(16).slice(2));
    localStorage.setItem(KEY, sid);
  }
  return sid;
}
