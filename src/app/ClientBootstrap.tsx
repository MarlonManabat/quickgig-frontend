'use client';
import { useEffect } from 'react';
import { initMonitoring } from '@/lib/monitoring';

const LOGIN_PHP = 'login.php';
const REGISTER_PHP = 'register.php';

function mapPhpToProxy(url: string): string | null {
  try {
    const u = new URL(url, window.location.origin);
    const isPhp =
      u.pathname.endsWith('/' + LOGIN_PHP) ||
      u.pathname.endsWith('/' + REGISTER_PHP);
    const isQG = /\.?quickgig\.ph$/i.test(u.hostname);
    if (isPhp && isQG) {
      if (u.pathname.endsWith('/' + LOGIN_PHP)) return '/api/session/login';
      if (u.pathname.endsWith('/' + REGISTER_PHP)) return '/api/session/register';
    }
  } catch {}
  return null;
}

export default function ClientBootstrap() {
  useEffect(() => {
    initMonitoring();

    const origFetch = window.fetch.bind(window);
    window.fetch = (async (
      input: RequestInfo | URL,
      init?: RequestInit
    ) => {
      const raw = typeof input === 'string' ? input : (input as Request)?.url ?? '';
      const mapped = typeof raw === 'string' ? mapPhpToProxy(raw) : null;
      if (mapped) {
        init = { ...(init || {}), credentials: 'include' };
        input = mapped;
        // eslint-disable-next-line no-console
        console.warn('[auth-intercept] Rewrote cross-origin PHP call to', mapped);
      }
      return origFetch(input as RequestInfo, init);
    }) as typeof fetch;

    const fixForms = () => {
      document.querySelectorAll('form[action]').forEach((f) => {
        const form = f as HTMLFormElement;
        const a = form.getAttribute('action') || '';
        const mapped = mapPhpToProxy(a);
        if (mapped) {
          form.setAttribute('action', mapped);
          form.method = 'post';
          form.noValidate = form.noValidate;
          // eslint-disable-next-line no-console
          console.warn('[auth-intercept] Rewrote form action to', mapped);
        }
      });
    };
    fixForms();
    const obs = new MutationObserver(fixForms);
    obs.observe(document.documentElement, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['action'],
    });
    return () => {
      window.fetch = origFetch;
      obs.disconnect();
    };
  }, []);

  return null;
}

