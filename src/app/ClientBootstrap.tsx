'use client';
import { useEffect } from 'react';

export default function ClientBootstrap() {
  useEffect(() => {
    // 1) Intercept fetch
    const origFetch = window.fetch;
    window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === 'string'
        ? input
        : input instanceof URL
          ? input.href
          : (input as Request).url;

      const m = typeof url === 'string' &&
        url.match(/^https?:\/\/(api\.)?quickgig\.ph\/(auth\/)?(login|register|me)\.php/i);

      if (m) {
        const name = m[3];
        const target = `/api/session/${name}`;
        console.warn('[auth-guard][fetch] rerouting', url, '→', target);
        input = target;
      }
      return origFetch(input as RequestInfo, init);
    };

    // 2) Intercept XMLHttpRequest (axios, legacy code)
    const origOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(
      method: string,
      url: string,
      async?: boolean,
      username?: string | null,
      password?: string | null
    ) {
      const m = typeof url === 'string' &&
        url.match(/^https?:\/\/(api\.)?quickgig\.ph\/(auth\/)?(login|register|me)\.php/i);
      if (m) {
        const name = m[3];
        const target = `/api/session/${name}`;
        console.warn('[auth-guard][xhr] rerouting', url, '→', target);
        return origOpen.call(this, method, target, async ?? true, username ?? null, password ?? null);
      }
      return origOpen.call(this, method, url, async ?? true, username ?? null, password ?? null);
    };

    console.log('[auth-guard] installed');
    return () => {
      window.fetch = origFetch;
      XMLHttpRequest.prototype.open = origOpen;
    };
  }, []);

  return null;
}
