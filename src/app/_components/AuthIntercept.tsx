"use client";
import { useEffect } from 'react';

function mapPhpToProxy(url: string): string | null {
  try {
    const u = new URL(url, window.location.origin);
    const isPhp =
      u.pathname.endsWith('/login.php') || u.pathname.endsWith('/register.php');
    const isQuickGig = /\.?quickgig\.ph$/i.test(u.hostname);
    if (isPhp && isQuickGig) {
      if (u.pathname.endsWith('/login.php')) return '/api/session/login';
      if (u.pathname.endsWith('/register.php')) return '/api/session/register';
    }
  } catch {}
  return null;
}

export default function AuthIntercept() {
  useEffect(() => {
    // 1) fetch() rewrite
    const origFetch = window.fetch.bind(window);
    window.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
      const raw =
        typeof input === 'string'
          ? input
          : input instanceof URL
          ? input.href
          : (input as Request).url;
      const mapped = typeof raw === 'string' ? mapPhpToProxy(raw) : null;
      if (mapped) {
        init = { ...(init || {}), credentials: 'include' };
        input = mapped;
        console.warn('[auth-intercept] rewrote PHP auth call ->', mapped);
      }
      return origFetch(input, init);
    }) as typeof fetch;

    // 2) form action rewrite
    const fixForms = () => {
      document.querySelectorAll('form[action]').forEach((el) => {
        const form = el as HTMLFormElement;
        const a = form.getAttribute('action') || '';
        const mapped = mapPhpToProxy(a);
        if (mapped) {
          form.setAttribute('action', mapped);
          form.method = 'post';
          console.warn('[auth-intercept] rewrote form action ->', mapped);
        }
      });
    };
    fixForms();
    const obs = new MutationObserver(fixForms);
    obs.observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ['action'] });
    return () => obs.disconnect();
  }, []);
  return null;
}
