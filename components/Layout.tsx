import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Banner from './Banner';
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
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="max-w-3xl mx-auto flex items-center justify-between px-4 py-4">
          <Link href="/" className="text-lg font-semibold">QuickGig.ph</Link>
          <nav className="flex-1 space-x-4 text-center text-sm">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className={isActive(l.href) ? 'font-bold underline' : undefined}>
                {l.label}
              </Link>
            ))}
          </nav>
          {user && <NotificationsBell />}
        </div>
      </header>
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 py-8">
          {banner && <Banner kind="success">{banner}</Banner>}
          {children}
        </div>
      </main>
      <footer className="border-t text-center py-4 text-sm text-gray-500">
        © {new Date().getFullYear()} QuickGig.ph
      </footer>
    </div>
  );
}
