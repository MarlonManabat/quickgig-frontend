import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import NotificationsBell from "@/components/NotificationsBell";

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
    <nav className="w-full sticky top-0 z-20 bg-slate-900/90 border-b border-slate-800 backdrop-blur text-white">
      <div className="mx-auto max-w-5xl px-4 py-3 flex items-center gap-4">
        <Link href="/" className="font-semibold">QuickGig.ph</Link>
        <div className="ml-auto flex items-center gap-4 text-sm">
          <Link href="/find-work">Find Work</Link>
          {loggedIn && <Link href="/dashboard/gigs">My Gigs</Link>}
          {loggedIn && <Link href="/applications">Applications</Link>}
          {loggedIn && <Link href="/saved">Saved</Link>}
          {loggedIn && <NotificationsBell />}
          {loggedIn && !eligible && (
            <Link href="/checkout" className="rounded px-3 py-1 bg-blue-500 text-white font-medium">
              Buy Ticket
            </Link>
          )}
          <Link
            href="/post-job"
            className={`rounded px-3 py-1 bg-yellow-400 text-black font-medium ${loggedIn && !eligible ? 'opacity-50 pointer-events-none' : ''}`}
            title={loggedIn && !eligible ? 'Please buy a ticket (₱10)' : undefined}
          >
            Post Job
          </Link>
          <Link href="/auth">Auth</Link>
        </div>
      </div>
    </nav>
  );
}
