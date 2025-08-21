import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import Shell from "@/components/Shell";

export default function FindWorkPage() {
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("gigs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) setError(error);
      else setData(data ?? []);
      setLoading(false);
    })();
  }, []);

  return (
    <Shell>
      <h1 className="text-2xl font-bold mb-4">Latest Gigs</h1>
      {loading && <p>Loading…</p>}
      {error && <p className="text-red-400">{error.message}</p>}
      <ul className="grid sm:grid-cols-2 gap-4">
        {data.map((g: any) => (
          <li key={g.id} className="rounded border border-slate-800 p-4 bg-slate-900">
            <h3 className="font-semibold text-lg">{g.title}</h3>
            <p className="text-sm opacity-80 line-clamp-2">{g.description}</p>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span>{g.city ?? "—"}</span>
              <Link className="underline" href={`/gigs/${g.id}`}>View</Link>
            </div>
          </li>
        ))}
      </ul>
    </Shell>
  );
}
