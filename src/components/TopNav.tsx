import Link from "next/link";
import LinkApp from "@/components/LinkApp";
import { ROUTES } from "@/lib/routes";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import AppHeaderNotifications from "@/components/AppHeaderNotifications";
import AppHeaderTickets from "@/components/AppHeaderTickets";
import { copy } from "@/copy";
import { TICKET_PRICE_PHP } from "@/lib/payments";

export default function TopNav() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [eligible, setEligible] = useState(true);
  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      const user = data.user;
      setLoggedIn(!!user);
      if (user) {
        const res = await fetch("/api/users/me/eligibility");
        if (res.ok) {
          const d = await res.json();
          setEligible(d.canPost);
        }
      }
    });
  }, []);

  return (
    <nav
      className="w-full sticky top-0 z-20 border-b border-brand-border bg-brand-bg backdrop-blur text-brand"
      data-app-header="true"
      data-testid="app-header"
    >
      <div className="mx-auto max-w-5xl px-4 py-3 flex items-center gap-4">
        <Link href="/home" className="font-semibold">
          QuickGig.ph
        </Link>
        <div className="ml-auto flex items-center gap-4 text-sm">
            <Link href="/gigs" data-testid="nav-find">
              {copy.nav.findWork}
            </Link>
          {loggedIn && <Link href="/dashboard/gigs">{copy.nav.myGigs}</Link>}
          {loggedIn && (
            <Link href="/applications">{copy.nav.applications}</Link>
          )}
          {loggedIn && <Link href="/saved">{copy.nav.saved}</Link>}
          {loggedIn && <AppHeaderTickets />}
          {loggedIn && <AppHeaderNotifications />}
          {loggedIn && !eligible && (
            <Link href="/checkout" className="btn-primary">
              Buy Ticket
            </Link>
          )}
            <Link
              href={ROUTES.postJob}
              data-testid="nav-post"
              className={`btn-primary ${loggedIn && !eligible ? "opacity-50 pointer-events-none" : ""}`}
              title={
                loggedIn && !eligible
                  ? `Please buy a ticket (₱${TICKET_PRICE_PHP})`
                  : undefined
              }
            >
              {copy.nav.postJob}
            </Link>
          <LinkApp href={ROUTES.login} data-testid="nav-login">
            {copy.nav.auth}
          </LinkApp>
        </div>
      </div>
    </nav>
  );
}
