"use client";

import { useState } from 'react';
import Link from 'next/link';
import { NAV_ITEMS, ROUTES } from '@/lib/routes';
import { authAware } from '@/lib/hostAware';
import { track } from '@/lib/analytics';

export default function LandingHeader() {
  const [open, setOpen] = useState(false);
  const links = NAV_ITEMS.map(item => {
    const href = item.auth === 'auth-aware' ? authAware(item.to) : item.to;
    const external = /^https?:\/\//.test(href);
    return {
      href,
      external,
      label: item.label,
      testId: item.id,
    };
  });

  return (
    <header className="border-b bg-white/60 backdrop-blur">
      <div className="mx-auto max-w-5xl flex items-center justify-between p-4">
        <Link href={ROUTES.home} className="font-semibold">
          QuickGig
        </Link>
        <nav className="hidden md:flex items-center gap-4">
          {links.map(link => (
            <Link
              key={link.testId}
              data-testid={link.testId}
              data-cta={link.testId}
              href={link.href}
              rel={link.external ? 'noopener' : undefined}
              prefetch={!link.external}
              className="hover:underline"
              onClick={() => track('cta_click', { cta: link.testId })}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <button
          data-testid="nav-menu-button"
          aria-expanded={open}
          aria-controls="nav-menu"
          className="md:hidden"
          onClick={() => setOpen(o => !o)}
        >
          Menu
        </button>
      </div>
      {open ? (
        <div
          id="nav-menu"
          data-testid="nav-menu"
          role="dialog"
          aria-modal="true"
          className="md:hidden border-t bg-white"
        >
          <div className="flex flex-col gap-2 p-4">
            {links.map(link => (
              <Link
                key={link.testId}
                data-testid={link.testId}
                data-cta={link.testId}
                href={link.href}
                rel={link.external ? 'noopener' : undefined}
                prefetch={!link.external}
                onClick={() => {
                  setOpen(false);
                  track('cta_click', { cta: link.testId });
                }}
                className="link"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}
