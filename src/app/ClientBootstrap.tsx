'use client';
import { useEffect } from 'react';
import { initMonitoring } from '@/lib/monitoring';

const reAuth = /^https?:\/\/(api\.)?quickgig\.ph\/(auth\/)?(login|register|me)\.php/i;

export default function ClientBootstrap() {
  useEffect(() => {
    initMonitoring();
    // Intercept fetch
    const origFetch = window.fetch;
    window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
      const url =
        typeof input === 'string'
          ? input
          : input instanceof URL
          ? input.href
          : (input as Request).url;
      const m = typeof url === 'string' && url.match(reAuth);
      if (m) {
        const name = m[3];
        const target = `/api/session/${name}`;
        console.warn('[auth-guard][fetch] rerouting', url, '→', target);
        input = target;
      }
      return origFetch(input as RequestInfo, init);
    };

    // Intercept XHR (axios/legacy)
    const origOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (
      method: string,
      url: string,
      async?: boolean,
      username?: string | null,
      password?: string | null
    ) {
      const m = typeof url === 'string' && url.match(reAuth);
      if (m) {
        const name = m[3];
        const target = `/api/session/${name}`;
        console.warn('[auth-guard][xhr] rerouting', url, '→', target);
        return origOpen.call(this, method, target, async ?? true, username ?? null, password ?? null);
      }
      return origOpen.call(this, method, url, async ?? true, username ?? null, password ?? null);
    };

    // Intercept raw <form> posts to auth endpoints
    function onFormSubmit(e: Event) {
      const f = e.target as HTMLFormElement;
      if (!(f instanceof HTMLFormElement)) return;
      const action = f.action || '';
      const m = action.match(reAuth);
      if (!m) return;

      const name = m[3];
      const target = `/api/session/${name}`;
      console.warn('[auth-guard][form] rerouting', action, '→', target);
      e.preventDefault();

      // Serialize and send via same-origin fetch
      const fd = new FormData(f);
      const body: Record<string, string> = {};
      fd.forEach((v, k) => (body[k] = String(v)));

      fetch(target, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        credentials: 'same-origin',
      })
        .then((r) => r.json().catch(() => ({})))
        .then((json) => {
          if (json?.ok) window.location.replace('/dashboard');
          else alert(json?.message || 'Authentication failed');
        })
        .catch(() => alert('Auth service unreachable'));
    }
    document.addEventListener('submit', onFormSubmit, true);

    console.log('[auth-guard] installed');
    return () => {
      window.fetch = origFetch;
      XMLHttpRequest.prototype.open = origOpen;
      document.removeEventListener('submit', onFormSubmit, true);
    };
  }, []);

  return null;
}

