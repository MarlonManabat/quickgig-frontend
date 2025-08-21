import Shell from "@/components/Shell";
import { useRequireUser } from "@/lib/useRequireUser";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
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
      const withLatest = await Promise.all(
        apps.map(async (a: any) => {
          const { data: msg } = await supabase
            .from("messages")
            .select("created_at")
            .eq("application_id", a.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .single();
          return { ...a, latest_message: msg?.created_at };
        })
      );
      setRows(withLatest);
      setLoading(false);
    })();
  }, [ready, userId]);

  if (!ready) return <Shell><p>Loading…</p></Shell>;

  return (
    <Shell>
      <h1 className="text-2xl font-bold mb-4">My Applications</h1>
      {loading && <p>Loading…</p>}
      <ul className="space-y-3">
        {rows.map((r) => {
          const last = typeof window !== "undefined" ? localStorage.getItem(`app:lastSeen:${r.id}`) : null;
          const unread = r.latest_message && (!last || new Date(r.latest_message).getTime() > Number(last));
          return (
            <li key={r.id} className="rounded border border-slate-800 bg-slate-900">
              <Link href={`/applications/${r.id}`} className="flex justify-between p-4">
                <div>
                  <div className="font-semibold">{r.gigs?.title ?? "Gig"}</div>
                  <div className="text-sm opacity-80">{r.gigs?.city ?? "—"} • status: {r.status}</div>
                </div>
                {unread && <span className="w-2 h-2 rounded-full bg-yellow-400 self-center" />}
              </Link>
            </li>
          );
        })}
        {!loading && rows.length === 0 && <p>No applications.</p>}
      </ul>
    </Shell>
  );
}
