'use client';
import { useEffect } from 'react';

const reAuth = /^https?:\/\/(api\.)?quickgig\.ph\/(auth\/)?(login|register|me)(\.php)?/i;

export default function ClientBootstrap() {
  useEffect(() => {
    // fetch
    const origFetch = window.fetch;
    window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === 'string' ? input : input instanceof URL ? input.href : (input as Request).url;
      const m = typeof url === 'string' && url.match(reAuth);
      if (m) input = `/api/session/${m[3]}`;
      return origFetch(input as RequestInfo, init);
    };

    // XHR (axios/legacy)
    const origOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (
      method: string,
      url: string,
      async?: boolean,
      username?: string | null,
      password?: string | null,
    ) {
      const m = typeof url === 'string' && url.match(reAuth);
      return origOpen.call(this, method, m ? `/api/session/${m[3]}` : url, async ?? true, username ?? null, password ?? null);
    };

    // Raw <form action="https://quickgig.ph/login" method="post">
    function onFormSubmit(e: Event) {
      const f = e.target as HTMLFormElement;
      if (!(f instanceof HTMLFormElement)) return;
      const m = (f.action || '').match(reAuth);
      if (!m) return;

      e.preventDefault();
      const body: Record<string, string> = {};
      new FormData(f).forEach((v, k) => (body[k] = String(v)));

      fetch(`/api/session/${m[3]}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        credentials: 'same-origin',
      })
        .then((r) => r.json().catch(() => ({})))
        .then((j) => {
          if (j?.ok) window.location.replace('/dashboard');
          else alert(j?.message || 'Authentication failed');
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
