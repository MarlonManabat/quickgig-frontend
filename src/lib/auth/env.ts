export const pkceEnabled =
  (process.env.AUTH_PKCE_ENABLED ?? '').toLowerCase() === 'true';

export function hasPkceConfig() {
  const { AUTH_ISSUER, AUTH_CLIENT_ID, AUTH_REDIRECT_URI } = process.env;
  return Boolean(AUTH_ISSUER && AUTH_CLIENT_ID && AUTH_REDIRECT_URI);
}
