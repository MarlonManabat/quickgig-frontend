import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Image from 'next/image';
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
    <header className="sticky top-0 z-40 bg-header-bg text-header-text border-b border-white/10">
      <div className="container flex h-14 items-center justify-between">
        <LinkSafe href="/" className="flex items-center gap-2">
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
                className={`${active ? 'underline underline-offset-4' : ''} hover:text-white/90`}
              >
                {l.label}
              </LinkSafe>
            );
          })}
        </nav>
        <div className="flex items-center gap-4">
          {user ? (
            <LinkSafe href="/profile" className="text-sm hover:text-white/90">
              {copy.nav.auth}
            </LinkSafe>
          ) : (
            <>
              <LinkSafe href="/auth" className="text-sm hover:text-white/90">
                Mag-login
              </LinkSafe>
              <LinkSafe href="/auth" className="text-sm font-semibold hover:text-white/90">
                Gumawa ng account
              </LinkSafe>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
