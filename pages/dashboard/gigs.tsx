import Shell from "@/components/Shell";
import { useRequireUser } from "@/lib/useRequireUser";
import Link from "next/link";
import { supabase } from "@/utils/supabaseClient";
import { useEffect, useState } from "react";

export default function MyGigs() {
  const { ready, userId, timedOut } = useRequireUser();
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  async function load(uid: string) {
    const { data, error } = await supabase
      .from("gigs")
      .select("*")
      .eq("owner", uid)
      .order("created_at", { ascending: false });
    if (error) setError(error);
    else setData(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    if (ready && userId) {
      setLoading(true);
      load(userId);
    }
  }, [ready, userId]);

  async function del(id: number) {
    if (!confirm("Delete this gig?")) return;
    const { error } = await supabase.from("gigs").delete().eq("id", id);
    if (!error && userId) load(userId);
  }

  if (!ready)
    return (
      <Shell>
        {timedOut ? (
          <p>
            Hindi ma-load ang auth.{" "}
            <Link className="underline" href="/auth">
              Go to Login
            </Link>
          </p>
        ) : (
          <p>Loading…</p>
        )}
      </Shell>
    );

  return (
    <Shell>
      <h1 className="text-2xl font-bold mb-4">My Gigs</h1>
      {loading && <p>Loading…</p>}
      {error && <p className="text-brand-danger">{error.message}</p>}
      <ul className="space-y-3">
        {data.map((g: any) => (
          <li key={g.id} className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">{g.title}</div>
                <div className="text-sm text-brand-subtle">
                  {g.city ?? "—"} • #{g.id}
                </div>
              </div>
              <div className="flex gap-3">
                <Link className="underline" href={`/gigs/${g.id}`}>
                  View
                </Link>
                <Link className="underline" href={`/gigs/${g.id}/edit`}>
                  Edit
                </Link>
                <button
                  onClick={() => del(g.id)}
                  className="underline text-brand-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Shell>
  );
}
