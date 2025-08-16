'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  html: string;
  nextUrl?: string;
}

export default function LegacyLogin({ html, nextUrl }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const legacyLogin = ['login', 'php'].join('.');
    document
      .querySelectorAll(`a[href*="quickgig.ph/${legacyLogin}"]`)
      .forEach((el) => {
        const a = el as HTMLAnchorElement;
        a.href = '/login';
      });
    document
      .querySelectorAll(`form[action*="quickgig.ph/${legacyLogin}"]`)
      .forEach((el) => {
        const f = el as HTMLFormElement;
        f.action = '/api/session/login';
        f.method = 'post';
      });

    const container = containerRef.current;
    if (!container) return;
    const form = container.querySelector('form');
    const email = container.querySelector('input[name="email"]') as HTMLInputElement | null;
    const password = container.querySelector('input[name="password"]') as HTMLInputElement | null;
    const errorBanner = container.querySelector('.error-banner') as HTMLDivElement | null;

    if (!form || !email || !password) return;

    const handleSubmit = async (e: Event) => {
      e.preventDefault();
      if (errorBanner) errorBanner.setAttribute('hidden', '');
      const res = await fetch('/api/session/login', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.value, password: password.value }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        router.push(nextUrl || '/dashboard');
        return;
      }
      if (errorBanner) {
        const msg = typeof data.message === 'string' ? data.message : 'Invalid email or password';
        errorBanner.textContent = msg;
        errorBanner.removeAttribute('hidden');
        errorBanner.focus();
        setTimeout(() => email.focus(), 0);
      } else {
        email.focus();
      }
    };

    form.addEventListener('submit', handleSubmit);
    return () => form.removeEventListener('submit', handleSubmit);
  }, [router]);

  return <div ref={containerRef} dangerouslySetInnerHTML={{ __html: html }} />;
}

