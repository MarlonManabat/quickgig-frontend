export function isSignedIn(): boolean {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem('DEV_AUTH') === 'true';
}
