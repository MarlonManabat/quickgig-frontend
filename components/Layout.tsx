import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Banner from './Banner';

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
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold">QuickGig.ph</Link>
          <nav className="space-x-4 text-sm">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className={isActive(l.href) ? 'font-bold underline' : undefined}>
                {l.label}
              </Link>
            ))}
          </nav>
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
