import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import NotificationsBell from "@/components/NotificationsBell";
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
        const res = await fetch('/api/users/me/eligibility');
        if (res.ok) {
          const d = await res.json();
          setEligible(d.canPost);
        }
      }
    });
  }, []);

  return (
    <nav className="w-full sticky top-0 z-20 border-b border-brand-border bg-brand-bg backdrop-blur text-brand">
      <div className="mx-auto max-w-5xl px-4 py-3 flex items-center gap-4">
        <Link href="/" className="font-semibold">QuickGig.ph</Link>
        <div className="ml-auto flex items-center gap-4 text-sm">
          <Link href="/find-work">{copy.nav.findWork}</Link>
          {loggedIn && <Link href="/dashboard/gigs">{copy.nav.myGigs}</Link>}
          {loggedIn && <Link href="/applications">{copy.nav.applications}</Link>}
          {loggedIn && <Link href="/saved">{copy.nav.saved}</Link>}
          {loggedIn && <NotificationsBell />}
          {loggedIn && !eligible && (
            <Link href="/checkout" className="btn-primary">
              Buy Ticket
            </Link>
          )}
          <Link
            href="/post-job"
            className={`btn-primary ${loggedIn && !eligible ? 'opacity-50 pointer-events-none' : ''}`}
            title={
              loggedIn && !eligible
                ? `Please buy a ticket (₱${TICKET_PRICE_PHP})`
                : undefined
            }
          >
            {copy.nav.postJob}
          </Link>
          <Link href="/auth">{copy.nav.auth}</Link>
        </div>
      </div>
    </nav>
  );
}
