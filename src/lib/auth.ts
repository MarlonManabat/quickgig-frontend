export function saveToken(t: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', t);
  }
}

export function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

export function clearAuth() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
  }
}

export function isAuthed() {
  return !!getToken();
}
