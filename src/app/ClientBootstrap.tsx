'use client';
import { useEffect } from 'react';

/** Intercepts any client fetch to engine auth endpoints and reroutes to our proxy */
export default function ClientBootstrap() {
  useEffect(() => {
    const orig = window.fetch;
    window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === 'string'
        ? input
        : input instanceof URL
          ? input.href
          : (input as Request).url;

      if (typeof url === 'string') {
        if (/^https?:\/\/(api\.)?quickgig\.ph\/(auth\/)?login\.php/i.test(url)) {
          console.warn('[auth-guard] rerouting → /api/session/login');
          input = '/api/session/login';
        }
        if (/^https?:\/\/(api\.)?quickgig\.ph\/(auth\/)?register\.php/i.test(url)) {
          console.warn('[auth-guard] rerouting → /api/session/register');
          input = '/api/session/register';
        }
        if (/^https?:\/\/(api\.)?quickgig\.ph\/(auth\/)?me\.php/i.test(url)) {
          console.warn('[auth-guard] rerouting → /api/session/me');
          input = '/api/session/me';
        }
      }
      return orig(input, init);
    };
    return () => { window.fetch = orig; };
  }, []);
  return null;
}
