import { pkceEnabled, hasPkceConfig } from '@/lib/auth/env';

export function loginNext(dest: string) {
  if (pkceEnabled && hasPkceConfig()) {
    return `/api/auth/pkce/start?next=${encodeURIComponent(dest)}`;
  }
  return `/login?next=${encodeURIComponent(dest)}`;
}
