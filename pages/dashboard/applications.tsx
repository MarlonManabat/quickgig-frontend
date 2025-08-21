import Shell from "@/components/Shell";
import { useRequireUser } from "@/lib/useRequireUser";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";

export default function MyApplications() {
  const { ready, userId } = useRequireUser();
  const [rows, setRows] = useState<any[]>([]);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ready) return;
    setLoading(true);
    supabase
      .from("applications")
      .select("id, status, created_at, gigs(id, title, city)")
      .eq("worker", userId)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) setError(error);
        else setRows(data ?? []);
        setLoading(false);
      });
  }, [ready, userId]);

  if (!ready) return <Shell><p>Loading…</p></Shell>;

  return (
    <Shell>
      <h1 className="text-2xl font-bold mb-4">My Applications</h1>
      {loading && <p>Loading…</p>}
      {error && <p className="text-red-400">{error.message}</p>}
      <ul className="space-y-3">
        {rows.map((r: any) => (
          <li key={r.id} className="rounded border border-slate-800 p-4 bg-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">{r.gigs?.title ?? "Gig"}</div>
                <div className="text-sm opacity-80">{r.gigs?.city ?? "—"} • status: {r.status}</div>
              </div>
              {r.gigs?.id && <Link className="underline" href={`/gigs/${r.gigs.id}`}>View</Link>}
            </div>
          </li>
        ))}
      </ul>
    </Shell>
  );
}

