import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import LinkSafe from './LinkSafe';
import { supabase } from '@/utils/supabaseClient';
import { copy } from '@/copy';

const links = [
  { href: '/gigs', label: copy.nav.findWork },
  { href: '/gigs?mine=1', label: copy.nav.myGigs },
  { href: '/applications', label: copy.nav.applications },
  { href: '/saved', label: copy.nav.saved },
  { href: '/gigs/new', label: copy.nav.postJob },
];

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

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
    <header className="sticky top-0 z-20 bg-brand-foreground text-white shadow-soft">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        <LinkSafe href="/" className="font-semibold">QuickGig.ph</LinkSafe>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {links.map((l) => {
            const active = isActive(l.href);
            return (
              <LinkSafe
                key={l.href}
                href={l.href}
                className={active ? 'underline underline-offset-4' : undefined}
              >
                {l.label}
              </LinkSafe>
            );
          })}
        </nav>
        <div className="flex items-center gap-4">
          {user ? (
            <LinkSafe href="/profile" className="text-sm">
              {copy.nav.auth}
            </LinkSafe>
          ) : (
            <>
              <LinkSafe href="/auth" className="text-sm">
                Mag-login
              </LinkSafe>
              <LinkSafe href="/auth" className="text-sm font-semibold">
                Gumawa ng account
              </LinkSafe>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
