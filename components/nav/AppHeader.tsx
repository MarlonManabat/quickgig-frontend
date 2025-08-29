import Link from "next/link";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { supabase } from "@/utils/supabaseClient";
import { safeSelect } from "@/lib/supabase-safe";
import { getStubRole } from "@/lib/testAuth";
import AppHeaderNotifications from "@/components/AppHeaderNotifications";
import AppLogo from "@/components/AppLogo";
import { APP_URL } from "@/lib/urls";

export default function AppHeader() {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<"worker" | "employer" | null>(null);
  const [open, setOpen] = useState(false);
  const { data: ticketData } = useSWR(
    user && role === "employer" ? (["tickets", user.id] as const) : null,
    async () => {
      const { data } = await supabase
        .from("profiles")
        .select("tickets")
        .eq("id", user!.id)
        .single();
      return data?.tickets ?? 0;
    },
  );
  const tickets = (ticketData as number | undefined) ?? 0;

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
      const prof = await safeSelect<any>(
        supabase.from("profiles").select("role_pref").single(),
      );
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
              <Link href="/find?focus=search" data-testid="nav-find">Find work</Link>
              <Link href="/jobs/new" data-testid="nav-post">Post job</Link>
              <Link href="/login" data-testid="nav-login">Login</Link>
            </>
          )}
          {user && role === "worker" && (
            <Link href="/find?focus=search" data-testid="nav-find">Find work</Link>
          )}
          {user && role === "employer" && (
            <>
              <Link
                href={tickets > 0 ? "/jobs/new" : "/wallet"}
                data-testid="nav-post"
                className={tickets === 0 ? "opacity-50" : undefined}
              >
                Post job
              </Link>
              <Link href="/find?focus=search" data-testid="nav-find">Find work</Link>
            </>
          )}
          {user && role === "employer" && tickets !== undefined && (
            <span
              data-testid="tickets-pill"
              className="text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-800"
            >
              Tickets: {tickets}
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
                  href="/find?focus=search"
                  className="py-2"
                  data-testid="nav-find"
                >
                  Find work
                </Link>
                <Link
                  href="/jobs/new"
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
              <Link href="/find?focus=search" className="py-2" data-testid="nav-find">
                Find work
              </Link>
            )}
            {user && role === "employer" && (
              <>
                <Link
                  href={tickets > 0 ? "/jobs/new" : "/wallet"}
                  className="py-2"
                  data-testid="nav-post"
                >
                  Post job
                </Link>
                <Link href="/find?focus=search" className="py-2" data-testid="nav-find">
                  Find work
                </Link>
              </>
            )}
            <Link href="/notifications" className="py-2">
              Notifications
            </Link>
            <a
              href="${APP_URL}/post"
              className="sm:hidden block px-4 py-3 rounded-lg bg-black text-white text-sm font-semibold text-center"
            >
              Post a Job
            </a>
          </div>
        )}
      </div>
    </header>
  );
}
