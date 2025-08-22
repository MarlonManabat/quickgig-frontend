import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Banner from '@/components/ui/Banner';
import NotificationsBell from './NotificationsBell';
import { supabase } from '@/utils/supabaseClient';

const links = [
  { href: '/gigs', label: 'Find Work' },
  { href: '/gigs?mine=1', label: 'My Gigs' },
  { href: '/applications', label: 'Applications' },
  { href: '/saved', label: 'Saved' },
  { href: '/gigs/new', label: 'Post Job' },
  { href: '/auth', label: 'Auth' },
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
                >
                  {l.label}
                </Link>
              );
            })}
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
