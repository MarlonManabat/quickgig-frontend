import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import NotificationsBell from "@/components/NotificationsBell";

export default function TopNav() {
  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setLoggedIn(!!data.user));
  }, []);

  return (
    <nav className="w-full sticky top-0 z-20 bg-slate-900/90 border-b border-slate-800 backdrop-blur text-white">
      <div className="mx-auto max-w-5xl px-4 py-3 flex items-center gap-4">
        <Link href="/" className="font-semibold">QuickGig.ph</Link>
        <div className="ml-auto flex items-center gap-4 text-sm">
          <Link href="/find-work">Find Work</Link>
          {loggedIn && <Link href="/dashboard/gigs">My Gigs</Link>}
          {loggedIn && <Link href="/applications">Applications</Link>}
          {loggedIn && <NotificationsBell />}
          <Link href="/post-job" className="rounded px-3 py-1 bg-yellow-400 text-black font-medium">
            Post Job
          </Link>
          <Link href="/login">Login</Link>
        </div>
      </div>
    </nav>
  );
}
