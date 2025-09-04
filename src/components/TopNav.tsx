import LinkApp from "@/components/LinkApp";
import { ROUTES } from "@/app/lib/routes";
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
        <LinkApp href="/home" className="font-semibold">
          QuickGig.ph
        </LinkApp>
        <div className="ml-auto flex items-center gap-4 text-sm">
            <LinkApp href={ROUTES.BROWSE_JOBS} data-testid="nav-browse-jobs">
              {copy.nav.findWork}
            </LinkApp>
          {loggedIn && <LinkApp href="/dashboard/gigs">{copy.nav.myGigs}</LinkApp>}
          {loggedIn && (
            <LinkApp href={ROUTES.APPLICATIONS}>{copy.nav.applications}</LinkApp>
          )}
          {loggedIn && <LinkApp href="/saved">{copy.nav.saved}</LinkApp>}
          {loggedIn && <AppHeaderTickets />}
          {loggedIn && <AppHeaderNotifications />}
          {loggedIn && !eligible && (
            <LinkApp href="/checkout" className="btn-primary">
              Buy Ticket
            </LinkApp>
          )}
            <LinkApp
              href={ROUTES.GIGS_CREATE}
              data-testid="nav-post-job"
              className={`btn-primary ${loggedIn && !eligible ? "opacity-50 pointer-events-none" : ""}`}
              title={
                loggedIn && !eligible
                  ? `Please buy a ticket (₱${TICKET_PRICE_PHP})`
                  : undefined
              }
            >
              {copy.nav.postJob}
            </LinkApp>
          <LinkApp href={ROUTES.LOGIN} data-testid="nav-login">
            {copy.nav.auth}
          </LinkApp>
        </div>
      </div>
    </nav>
  );
}
