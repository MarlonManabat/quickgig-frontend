import Shell from "@/components/Shell";
import { useRequireUser } from "@/lib/useRequireUser";
import Link from "next/link";
import { supabase } from "@/utils/supabaseClient";
import { getUnreadCount } from "@/lib/reads";
import { useEffect, useState } from "react";

export default function ApplicationsList() {
  const { ready, userId } = useRequireUser();
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ready) return;
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from("applications")
        .select("id, status, created_at, gigs(id,title,city)")
        .eq("worker", userId)
        .order("created_at", { ascending: false });
      const apps = data ?? [];
      const withUnread = await Promise.all(
        apps.map(async (a: any) => {
          const unread = await getUnreadCount(a.id, userId!);
          return { ...a, unread };
        })
      );
      setRows(withUnread);
      setLoading(false);
    })();
  }, [ready, userId]);

  if (!ready) return <Shell><p>Loading…</p></Shell>;

  return (
    <Shell>
      <h1 className="text-2xl font-bold mb-4">My Applications</h1>
      {loading && <p>Loading…</p>}
      <ul className="space-y-3">
        {rows.map((r) => (
            <li key={r.id} className="rounded border border-slate-800 bg-slate-900">
              <Link href={`/applications/${r.id}`} className="flex justify-between p-4">
                <div>
                  <div className="font-semibold">{r.gigs?.title ?? "Gig"}</div>
                  <div className="text-sm opacity-80">{r.gigs?.city ?? "—"} • status: {r.status}</div>
                </div>
                {r.unread > 0 && <span className="w-2 h-2 rounded-full bg-yellow-400 self-center" />}
              </Link>
            </li>
        ))}
        {!loading && rows.length === 0 && <p>No applications.</p>}
      </ul>
    </Shell>
  );
}
