import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import AppHeaderNotifications from "@/components/AppHeaderNotifications";
import AppHeaderTickets from "@/components/AppHeaderTickets";
import AppLogo from "@/components/AppLogo";
import { asNumber } from "@/lib/normalize";
import type { WalletRow } from "@/lib/types";

export default function AppHeader() {
  const [balance, setBalance] = useState<number | null>(null);
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<"worker" | "employer" | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      const user = data.user;
      setUser(user);
      if (!user) return;
      const { data: prof } = await supabase
        .from("profiles")
        .select("can_post_job, can_post, role_pref")
        .single();
      setRole((prof?.role_pref as "worker" | "employer" | null) ?? null);
      const canPost = prof?.can_post_job ?? prof?.can_post;
      if (!canPost) return;
      const { data: bal, error } = await supabase
        .from("ticket_balances")
        .select("balance")
        .single<WalletRow>();
      if (error) {
        setBalance(0);
      } else {
        setBalance(asNumber(bal?.balance) ?? 0);
      }
    });
  }, []);

  const highlight = balance === 0 && balance !== null;

  return (
    <header
      data-app-header
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
              <Link href="/search?intent=worker" data-testid="nav-find">Find work</Link>
              <Link href="/post?intent=employer" data-testid="nav-post">Post job</Link>
              <Link href="/login" data-testid="nav-login">Login</Link>
            </>
          )}
          {user && role === "worker" && (
            <Link href="/find" data-testid="nav-find">Find work</Link>
          )}
          {user && role === "employer" && (
            <>
              <Link href="/post" data-testid="nav-post">Post job</Link>
              <Link href="/find" data-testid="nav-find">Find work</Link>
            </>
          )}
          {balance !== null && (
            <Link
              href="/pay"
              className={`inline-flex items-center ${
                highlight
                  ? "qg-btn qg-btn--primary px-3 py-1"
                  : "qg-btn qg-btn--white px-3 py-1"
              }`}
            >
              Add tickets
              <span className="ml-2 px-2 py-0.5 rounded-full bg-black text-white text-xs">
                {balance}
              </span>
            </Link>
          )}
          <AppHeaderTickets />
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
                  href="/search?intent=worker"
                  className="py-2"
                  data-testid="nav-find"
                >
                  Find work
                </Link>
                <Link
                  href="/post?intent=employer"
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
              <Link href="/find" className="py-2" data-testid="nav-find">
                Find work
              </Link>
            )}
            {user && role === "employer" && (
              <>
                <Link href="/post" className="py-2" data-testid="nav-post">
                  Post job
                </Link>
                <Link href="/find" className="py-2" data-testid="nav-find">
                  Find work
                </Link>
              </>
            )}
            <Link href="/notifications" className="py-2">
              Notifications
            </Link>
            {balance !== null && (
              <Link href="/pay" className="py-2">
                Add tickets ({balance})
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
