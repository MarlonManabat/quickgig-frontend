import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Banner from '@/components/ui/Banner';
import AppHeaderNotifications from '@/components/AppHeaderNotifications';
import AppHeaderTickets from '@/components/AppHeaderTickets';
import { supabase } from '@/utils/supabaseClient';
import { copy } from '@/copy';
import { isAdmin } from '@/utils/admin';
import Container from './Container';

const links = [
  { href: '/gigs', label: copy.nav.findWork, id: 'app-nav-find-work' },
  { href: '/gigs?mine=1', label: copy.nav.myGigs, id: 'app-nav-my-gigs' },
  { href: '/applications', label: copy.nav.applications, id: 'app-nav-applications' },
  { href: '/saved', label: copy.nav.saved, id: 'app-nav-saved' },
  { href: '/gigs/new', label: copy.nav.postJob, id: 'app-nav-post-job' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const banner = typeof router.query.banner === 'string' ? router.query.banner : null;
  const [user, setUser] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    isAdmin().then(setAdmin).catch(() => setAdmin(false));
  }, []);

  useEffect(() => {
    if (banner) {
      const q = { ...router.query } as any;
      delete q.banner;
      router.replace({ pathname: router.pathname, query: q }, undefined, { shallow: true });
    }
  }, [banner, router]);

  function isActive(href: string) {
    if (href === '/gigs?mine=1') return router.pathname === '/gigs' && router.query.mine === '1';
    return router.pathname === href;
  }

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg text-brand">
      <header className="sticky top-0 z-10 border-b border-brand-border bg-brand-surface" data-theme-brand="quickgig">
        <div className="max-w-4xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
          <Link href="/" className="text-lg font-semibold">QuickGig.ph</Link>
          <button
            className="sm:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle navigation"
          >
            ☰
          </button>
          <nav
            className={`${open ? 'block' : 'hidden'} sm:flex sm:items-center sm:gap-4 text-sm`}
          >
            {links.map((l) => {
              const active = isActive(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={active ? 'font-semibold underline' : undefined}
                  aria-current={active ? 'page' : undefined}
                  data-testid={l.id}
                  app-nav={l.href}
                >
                  {l.label}
                </Link>
              );
            })}
            {admin && (
              <Link
                href="/admin"
                className={isActive('/admin') ? 'font-semibold underline' : undefined}
                data-testid="app-nav-admin"
                app-nav="/admin"
              >
                {copy.admin.title}
              </Link>
            )}
            {user ? (
              <Link href="/profile" data-testid="app-nav-account" app-nav="/profile">Profile</Link>
            ) : (
              <Link href="/auth" data-testid="app-login" app-nav="/auth">{copy.nav.auth}</Link>
            )}
          </nav>
          {user && <AppHeaderTickets />}
          {user && <AppHeaderNotifications />}
        </div>
      </header>
      <main className="flex-1">
        {banner && <Banner kind="success">{banner}</Banner>}
        <Container>{children}</Container>
      </main>
      <footer className="border-t border-brand-border text-center py-4 text-sm text-brand-subtle">
        © {new Date().getFullYear()} QuickGig.ph
      </footer>
    </div>
  );
}
