"use client";

import { useState } from 'react';
import Link from 'next/link';
import { NAV_ITEMS, ROUTES } from '@/lib/routes';
import { track } from '@/lib/analytics';

export default function LandingHeader() {
  const [open, setOpen] = useState(false);
  const links = NAV_ITEMS.map(item => ({
    href: item.to,
    label: item.label,
    testIdDesktop: item.idDesktop,
    testIdMobile: item.idMobile,
  }));

  return (
    <header className="border-b bg-white/60 backdrop-blur">
      <div className="mx-auto max-w-5xl flex items-center justify-between p-4">
        <Link href={ROUTES.home} className="font-semibold">
          QuickGig
        </Link>
        <nav className="hidden md:flex items-center gap-4">
          {links.map(link => (
            <Link
              key={link.testIdDesktop}
              data-testid={link.testIdDesktop}
              data-cta={link.testIdDesktop}
              href={link.href}
              className="hover:underline"
              onClick={() => track('cta_click', { cta: link.testIdDesktop })}
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
                key={link.testIdMobile}
                data-testid={link.testIdMobile}
                data-cta={link.testIdMobile}
                href={link.href}
                onClick={() => {
                  setOpen(false);
                  track('cta_click', { cta: link.testIdMobile });
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
