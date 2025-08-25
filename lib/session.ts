export function hasMockSession() {
  if (process.env.NEXT_PUBLIC_TEST_LOGIN_ENABLED !== 'true') return false;
  if (typeof document === 'undefined') return false;
  return document.cookie.includes('__qg_test_session=');
}
