"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export type SiteHeaderProps = {
  authed: boolean;
  browseHref?: string;
  myApplicationsHref: string;
  postHref: string;
  loginHref: string;
  logoutHref: string;
};

type LinkConfig = {
  id: string;
  label: string;
  href: string;
  onClick?: () => void;
};

function useNavLinks({
  authed,
  browseHref,
  myApplicationsHref,
  postHref,
  loginHref,
  logoutHref,
  close,
}: {
  authed: boolean;
  browseHref: string;
  myApplicationsHref: string;
  postHref: string;
  loginHref: string;
  logoutHref: string;
  close: () => void;
}): LinkConfig[] {
  return useMemo(() => {
    const entries: LinkConfig[] = [
      { id: "nav-browse-jobs", label: "Browse Jobs", href: browseHref, onClick: close },
      { id: "nav-my-applications", label: "My Applications", href: myApplicationsHref, onClick: close },
      { id: "nav-post-job", label: "Post a Job", href: postHref, onClick: close },
    ];

    if (authed) {
      entries.push({ id: "nav-logout", label: "Logout", href: logoutHref, onClick: close });
    } else {
      entries.push({ id: "nav-login", label: "Login", href: loginHref, onClick: close });
    }

    return entries;
  }, [authed, browseHref, close, loginHref, logoutHref, myApplicationsHref, postHref]);
}

export default function SiteHeader({
  authed,
  browseHref = "/browse-jobs",
  myApplicationsHref,
  postHref,
  loginHref,
  logoutHref,
}: SiteHeaderProps) {
  const [open, setOpen] = useState(false);
  const closeMenu = () => setOpen(false);
  const links = useNavLinks({
    authed,
    browseHref,
    myApplicationsHref,
    postHref,
    loginHref,
    logoutHref,
    close: closeMenu,
  });

  return (
    <header className="w-full border-b bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/browse-jobs" className="font-bold">
          QuickGig
        </Link>
        <nav className="hidden gap-4 md:flex" data-testid="nav-menu">
          {links.map(({ id, label, href }) => (
            <Link key={id} data-testid={id} href={href} prefetch={false}>
              {label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          data-testid="nav-menu-button"
          className="rounded-xl border px-3 py-1 md:hidden"
          aria-expanded={open}
          aria-controls="site-header-menu"
          onClick={() => setOpen((value) => !value)}
        >
          Menu
        </button>
      </div>
      {open && (
        <div className="md:hidden px-4 pb-3" data-testid="nav-menu" id="site-header-menu">
          <div className="flex flex-col gap-2">
            {links.map(({ id, label, href, onClick }) => (
              <Link key={id} data-testid={id} href={href} onClick={onClick} prefetch={false}>
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
