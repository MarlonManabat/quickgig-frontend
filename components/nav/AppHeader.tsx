import Link from "next/link";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { supabase } from "@/utils/supabaseClient";
import { getStubRole } from "@/lib/testAuth";
import AppHeaderNotifications from "@/components/AppHeaderNotifications";
import AppLogo from "@/components/AppLogo";
import { getCredits } from "@/lib/credits";

export default function AppHeader() {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<"worker" | "employer" | null>(null);
  const [open, setOpen] = useState(false);
  const { data: credits } = useSWR(
    user && role === "employer" ? "credits" : null,
    getCredits,
  );

  useEffect(() => {
    const stub = getStubRole();
    if (stub) {
      setUser({});
      setRole(stub === "admin" ? "employer" : stub);
      return;
    }
    supabase.auth.getUser().then(async ({ data }) => {
      const user = data.user;
      setUser(user);
      if (!user) return;
      const { data: prof } = await supabase
        .from("profiles")
        .select("role_pref")
        .single();
      setRole((prof?.role_pref as "worker" | "employer" | null) ?? null);
    });
  }, []);

  return (
    <header
      data-app-header="true"
      data-testid="app-header"
      role="banner"
      className="sticky top-0 z-50 bg-white dark:bg-slate-900 shadow-sm"
    >
      <div className="max-w-6xl mx-auto px-4 h-full flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <AppLogo size={32} />
        </Link>
        <nav aria-label="Primary" className="hidden md:flex items-center gap-6">
          {!user && (
            <>
              <Link href="/search" data-testid="nav-find">Find work</Link>
              <Link href="/post" data-testid="nav-post">Post job</Link>
              <Link href="/login" data-testid="nav-login">Login</Link>
            </>
          )}
          {user && role === "worker" && (
            <Link href="/search" data-testid="nav-find">Find work</Link>
          )}
          {user && role === "employer" && (
            <>
              <Link href="/post" data-testid="nav-post">Post job</Link>
              <Link href="/search" data-testid="nav-find">Find work</Link>
            </>
          )}
          {user && role === "employer" && credits !== undefined && (
            <span
              data-testid="credits-pill"
              className="text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-800"
            >
              Credits: {credits}
            </span>
          )}
          <AppHeaderNotifications />
        </nav>
        <button
          type="button"
          aria-label="Open menu"
          data-testid="menu-toggle"
          className="md:hidden cursor-pointer"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          Menu
        </button>
        {open && (
          <div
            role="dialog"
            aria-label="Main menu"
            className="mt-2 flex flex-col md:hidden"
          >
            {!user && (
              <>
                <Link
                  href="/search"
                  className="py-2"
                  data-testid="nav-find"
                >
                  Find work
                </Link>
                <Link
                  href="/post"
                  className="py-2"
                  data-testid="nav-post"
                >
                  Post job
                </Link>
                <Link href="/login" className="py-2" data-testid="nav-login">
                  Login
                </Link>
              </>
            )}
            {user && role === "worker" && (
              <Link href="/search" className="py-2" data-testid="nav-find">
                Find work
              </Link>
            )}
            {user && role === "employer" && (
              <>
                <Link href="/post" className="py-2" data-testid="nav-post">
                  Post job
                </Link>
                <Link href="/search" className="py-2" data-testid="nav-find">
                  Find work
                </Link>
              </>
            )}
            <Link href="/notifications" className="py-2">
              Notifications
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
