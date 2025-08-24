import { useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function AdminHome() {
  useEffect(() => {
    // optional client-side guard (server-side RLS still applies)
    (async () => {
      const { data } = await supabase.from("profiles").select("role").limit(1);
      // if not admin, you could redirect or show a message
    })();
  }, []);

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Admin & Ops</h1>
      <nav className="flex gap-4 mb-6">
        <Link href="/admin/users" className="underline">
          Users
        </Link>
        <Link href="/admin/jobs" className="underline">
          Jobs
        </Link>
        <Link href="/admin/payments" className="underline">
          Payments
        </Link>
        <Link href="/admin/reviews" className="underline">
          Reviews
        </Link>
        <Link href="/admin/flags" className="underline">
          Feature Flags
        </Link>
      </nav>
      <p className="text-sm text-gray-600">
        Moderate content, manage payments, and toggle features. All actions are
        audited in DB tables.
      </p>
    </main>
  );
}
