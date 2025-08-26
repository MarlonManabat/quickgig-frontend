import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import LinkSafe from "./LinkSafe";
import Container from "./Container";
import { supabase } from "@/utils/supabaseClient";
import { copy } from "@/copy";
import AppLogo from "@/components/AppLogo";

const links = [
  { href: "/find", label: copy.nav.findWork, id: "app-nav-find-work" },
  { href: "/gigs?mine=1", label: copy.nav.myGigs, id: "app-nav-my-gigs" },
  {
    href: "/applications",
    label: copy.nav.applications,
    id: "app-nav-applications",
  },
  { href: "/saved", label: copy.nav.saved, id: "app-nav-saved" },
  { href: "/post", label: copy.nav.postJob, id: "app-nav-post-job" },
];

function IconMenu() {
  return (
    <svg
      viewBox="0 0 24 24"
      width={24}
      height={24}
      stroke="currentColor"
      strokeWidth={2}
      fill="none"
      strokeLinecap="round"
    >
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      },
    );
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  function isActive(href: string) {
    if (href === "/gigs?mine=1")
      return router.pathname === "/gigs" && router.query.mine === "1";
    return router.pathname === href;
  }

  return (
    <header
      data-app-header
      data-testid="app-header"
      data-theme-brand="quickgig"
      className="sticky top-0 z-40 qg-header border-b border-white/10"
    >
      <Container className="flex h-16 items-center justify-between">
        <LinkSafe
          href="/"
          className="flex items-center h-11 min-h-[44px] gap-2"
        >
          <AppLogo />
        </LinkSafe>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {links.map((l) => {
            const active = isActive(l.href);
            return (
              <LinkSafe
                key={l.href}
                href={l.href}
                data-testid={l.id}
                app-nav={l.href}
                className={`${active ? "opacity-100 underline underline-offset-4" : "opacity-90 hover:opacity-100"} h-11 min-h-[44px] inline-flex items-center`}
              >
                {l.label}
              </LinkSafe>
            );
          })}
        </nav>
        <div className="flex items-center gap-4">
          <button
            data-testid="menu-toggle"
            className="md:hidden inline-flex h-11 w-11 items-center justify-center rounded-lg text-white"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <IconMenu />
          </button>
          {user ? (
            <LinkSafe
              href="/profile"
              data-testid="app-nav-account"
              app-nav="/profile"
              className="hidden md:inline-flex h-11 min-h-[44px] items-center text-sm opacity-90 hover:opacity-100"
            >
              {copy.nav.auth}
            </LinkSafe>
          ) : (
            <>
              <LinkSafe
                href="/auth"
                data-testid="app-login"
                app-nav="/auth"
                className="hidden md:inline-flex qg-btn qg-btn--outline h-11 min-h-[44px]"
              >
                Mag-login
              </LinkSafe>
              <LinkSafe
                id="cta-app"
                href="/start"
                data-testid="app-signup"
                app-nav="/start"
                className="hidden md:inline-flex qg-btn qg-btn--primary h-11 min-h-[44px]"
              >
                Sign Up
              </LinkSafe>
            </>
          )}
        </div>
      </Container>
      {open && (
        <div className="md:hidden fixed inset-0 z-30 bg-header-bg text-white pt-16">
          <nav className="grid gap-1 p-6">
            {links.map((l) => (
              <LinkSafe
                key={l.href}
                href={l.href}
                data-testid={l.id}
                app-nav={l.href}
                className="h-11 min-h-[44px] flex items-center px-3"
              >
                {l.label}
              </LinkSafe>
            ))}
            {user ? (
              <LinkSafe
                href="/profile"
                data-testid="app-nav-account"
                app-nav="/profile"
                className="h-11 min-h-[44px] flex items-center px-3"
              >
                {copy.nav.auth}
              </LinkSafe>
            ) : (
              <LinkSafe
                href="/auth"
                data-testid="app-login"
                app-nav="/auth"
                className="qg-btn qg-btn--outline w-full h-11 min-h-[44px] flex items-center justify-center"
              >
                Mag-login
              </LinkSafe>
            )}
            <LinkSafe
              href="/start"
              data-testid="app-signup"
              app-nav="/start"
              className="qg-btn qg-btn--primary w-full h-11 min-h-[44px] text-center flex items-center justify-center"
            >
              Sign Up
            </LinkSafe>
          </nav>
        </div>
      )}
    </header>
  );
}
