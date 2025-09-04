'use client';
import React from 'react';
import Link from 'next/link';
import { useUser } from '@/hooks/useUser';
import { LinkApp } from '@/components/LinkApp';
import { ROUTES } from '@/app/lib/routes';

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

  const Links = () => (
    <>
      <LinkApp data-testid="nav-browse-jobs" href={ROUTES.browseJobs} prefetch={false}>
        Browse jobs
      </LinkApp>
      <LinkApp data-testid="nav-post-job" href={ROUTES.postJob} prefetch={false}>
        Post a job
      </LinkApp>
      <LinkApp data-testid="nav-my-applications" href={ROUTES.applications} prefetch={false}>
        My Applications
      </LinkApp>
      {user ? (
        <button onClick={() => signOut()} className="underline">
          Sign out
        </button>
      ) : (
        <LinkApp data-testid="nav-login" href={ROUTES.login} prefetch={false}>
          Sign in
        </LinkApp>
      )}
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
            <Links />
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
            <Links />
          </nav>
        </div>
      )}
    </header>
  );
}
