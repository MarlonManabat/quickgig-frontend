'use client';
import React from 'react';
import Link from 'next/link';
import { useUser } from '@/hooks/useUser';
import { LinkApp } from '@/components/LinkApp';
import { ROUTES } from '@/lib/routes';

type Props = { balance: number };

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const handler = () => setIsDesktop(mq.matches);
    handler();
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return isDesktop;
}

export default function AppHeader({ balance }: Props) {
  const { user, signOut } = useUser();
  const [open, setOpen] = React.useState(false);
  const isDesktop = useIsDesktop();

  const CTAS = [
    { id: 'nav-browse-jobs', label: 'Browse jobs', to: ROUTES.browseJobs },
    { id: 'nav-post-job', label: 'Post a job', to: ROUTES.postJob },
    { id: 'nav-my-applications', label: 'My Applications', to: ROUTES.applications },
    { id: 'nav-login', label: 'Sign in', to: ROUTES.login },
  ] as const;

  const DesktopLinks = () => (
    <>
      {CTAS.map((c) => {
        if (c.id === 'nav-login' && user) {
          return (
            <button key="signout" onClick={() => signOut()} className="underline">
              Sign out
            </button>
          );
        }
        return (
          <LinkApp key={c.id} data-testid={c.id} href={c.to} prefetch={false}>
            {c.label}
          </LinkApp>
        );
      })}
    </>
  );

  const MobileLinks = () => (
    <>
      {CTAS.map((c) => {
        if (c.id === 'nav-login' && user) {
          return (
            <button key="signout" onClick={() => signOut()} className="underline">
              Sign out
            </button>
          );
        }
        return (
          <LinkApp
            key={c.id}
            data-testid={c.id.replace('nav-', 'navm-')}
            href={c.to}
            prefetch={false}
          >
            {c.label}
          </LinkApp>
        );
      })}
    </>
  );

  return (
    <header data-testid="app-header" className="border-b bg-white/60 backdrop-blur">
      <div className="mx-auto max-w-5xl flex items-center justify-between p-4">
        <Link href="/" className="font-semibold">
          QuickGig
        </Link>
        {isDesktop ? (
          <nav className="flex items-center gap-4">
            <DesktopLinks />
          </nav>
        ) : (
          <button
            className="md:hidden"
            data-testid="nav-menu-button"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            Menu
          </button>
        )}
        {isDesktop && (
          <span className="rounded-xl border px-2 py-1 text-sm" title="Tickets">
            🎟️ {balance}
          </span>
        )}
      </div>
      {!isDesktop && open && (
        <div className="md:hidden absolute top-full left-0 w-full shadow bg-white">
          <nav className="flex flex-col p-3 gap-3">
            <MobileLinks />
          </nav>
        </div>
      )}
    </header>
  );
}
