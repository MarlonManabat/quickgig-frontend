import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import LinkSafe from './LinkSafe';
import Container from './Container';
import { supabase } from '@/utils/supabaseClient';
import { copy } from '@/copy';

const links = [
  { href: '/gigs', label: copy.nav.findWork },
  { href: '/gigs?mine=1', label: copy.nav.myGigs },
  { href: '/applications', label: copy.nav.applications },
  { href: '/saved', label: copy.nav.saved },
  { href: '/gigs/new', label: copy.nav.postJob },
];

function IconMenu() {
  return (
    <svg
      viewBox="0 0 24 24"
      width={24}
      height={24}
      stroke="currentColor"
      strokeWidth={2}
      fill="none"
      strokeLinecap="round"
    >
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  function isActive(href: string) {
    if (href === '/gigs?mine=1') return router.pathname === '/gigs' && router.query.mine === '1';
    return router.pathname === href;
  }

  return (
    <header
      data-app-header
      className="sticky top-0 z-40 bg-header-bg text-header-text border-b border-white/10"
    >
      <Container className="flex h-14 items-center justify-between">
        <LinkSafe href="/" className="flex items-center gap-2 h-11 min-h-[44px]">
          <Image src="/logo.svg" alt="QuickGig.ph" width={28} height={28} priority />
          <span className="font-semibold">QuickGig.ph</span>
        </LinkSafe>
        <nav className="hidden md:flex items-center gap-4 text-sm">
          {links.map((l) => {
            const active = isActive(l.href);
            return (
              <LinkSafe
                key={l.href}
                href={l.href}
                className={`${active ? 'underline underline-offset-4' : ''} h-11 min-h-[44px] inline-flex items-center hover:text-white/90`}
              >
                {l.label}
              </LinkSafe>
            );
          })}
        </nav>
        <div className="flex items-center gap-4">
          <button
            data-testid="menu-toggle"
            className="md:hidden inline-flex h-11 w-11 items-center justify-center rounded-lg text-brand-fg"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <IconMenu />
          </button>
          {user ? (
            <LinkSafe
              href="/profile"
              className="hidden md:inline-flex h-11 min-h-[44px] items-center text-sm hover:text-white/90"
            >
              {copy.nav.auth}
            </LinkSafe>
          ) : (
            <LinkSafe
              href="/auth"
              className="hidden md:inline-flex h-11 min-h-[44px] items-center text-sm hover:text-white/90"
            >
              Mag-login
            </LinkSafe>
          )}
        </div>
      </Container>
      {open && (
        <div className="md:hidden border-t border-white/10 bg-brand-bg text-brand-fg">
          <nav className="grid gap-1 p-3">
            {links.map((l) => (
              <LinkSafe
                key={l.href}
                href={l.href}
                className="h-11 min-h-[44px] flex items-center px-3"
              >
                {l.label}
              </LinkSafe>
            ))}
            {user ? (
              <LinkSafe href="/profile" className="h-11 min-h-[44px] flex items-center px-3">
                {copy.nav.auth}
              </LinkSafe>
            ) : (
              <LinkSafe href="/auth" className="h-11 min-h-[44px] flex items-center px-3">
                Mag-login
              </LinkSafe>
            )}
            <LinkSafe
              href="/signup"
              className="btn-primary w-full h-11 min-h-[44px] rounded-xl text-center flex items-center justify-center"
            >
              Sign Up
            </LinkSafe>
          </nav>
        </div>
      )}
    </header>
  );
}
