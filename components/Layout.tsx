import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Banner from '@/components/ui/Banner';
import NotificationsBell from './NotificationsBell';
import { supabase } from '@/utils/supabaseClient';
import { copy } from '@/copy';

const links = [
  { href: '/gigs', label: copy.nav.findWork, id: 'nav-find' },
  { href: '/gigs?mine=1', label: copy.nav.myGigs, id: 'nav-my-gigs' },
  { href: '/applications', label: copy.nav.applications, id: 'nav-applications' },
  { href: '/saved', label: copy.nav.saved, id: 'nav-saved' },
  { href: '/gigs/new', label: copy.nav.postJob, id: 'nav-post' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const banner = typeof router.query.banner === 'string' ? router.query.banner : null;
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
      <header className="sticky top-0 z-10 border-b border-brand-border bg-brand-surface">
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
                >
                  {l.label}
                </Link>
              );
            })}
            {user ? (
              <Link href="/profile" data-testid="nav-profile">Profile</Link>
            ) : (
              <Link href="/auth" data-testid="nav-login">{copy.nav.auth}</Link>
            )}
          </nav>
          {user && <NotificationsBell />}
        </div>
      </header>
      <main className="flex-1 container-page">
        {banner && <Banner kind="success">{banner}</Banner>}
        {children}
      </main>
      <footer className="border-t border-brand-border text-center py-4 text-sm text-brand-subtle">
        © {new Date().getFullYear()} QuickGig.ph
      </footer>
    </div>
  );
}
