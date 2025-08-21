import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Shell from "@/components/Shell";
import Link from "next/link";
import SaveButton from "@/components/SaveButton";

const PAGE_SIZE = 12;

export default function FindWorkPage() {
  const [q, setQ] = useState("");
  const [city, setCity] = useState("");
  const [minBudget, setMinBudget] = useState<string>("");
  const [maxBudget, setMaxBudget] = useState<string>("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<any[]>([]);
  const [count, setCount] = useState(0);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    (async () => {
      let query = supabase.from("gigs").select("*", { count: "exact" }).neq('hidden', true);

      if (q.trim()) {
        query = query.ilike("title", `%${q}%`).or(`description.ilike.%${q}%`);
      }
      if (city) query = query.eq("city", city);
      if (minBudget) query = query.gte("budget", Number(minBudget));
      if (maxBudget) query = query.lte("budget", Number(maxBudget));

      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      query = query.order("created_at", { ascending: false }).range(from, to);

      const { data, count, error } = await query;
      if (ignore) return;
      if (error) setError(error);
      else {
        setError(null);
        setData(data ?? []);
        setCount(count ?? 0);
      }
      setLoading(false);
    })();
    return () => { ignore = true; };
  }, [q, city, minBudget, maxBudget, page]);

  const total = count;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <Shell>
      <h1 className="text-2xl font-bold mb-4">Latest Gigs</h1>

      <div className="mb-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search title/description"
               className="rounded bg-slate-900 border border-slate-700 px-3 py-2" />
        <input value={city} onChange={(e)=>setCity(e.target.value)} placeholder="City"
               className="rounded bg-slate-900 border border-slate-700 px-3 py-2" />
        <input value={minBudget} onChange={(e)=>setMinBudget(e.target.value)} placeholder="Min budget"
               className="rounded bg-slate-900 border border-slate-700 px-3 py-2" />
        <input value={maxBudget} onChange={(e)=>setMaxBudget(e.target.value)} placeholder="Max budget"
               className="rounded bg-slate-900 border border-slate-700 px-3 py-2" />
      </div>

      {loading && <p>Loading…</p>}
      {error && <p className="text-red-400">{error.message}</p>}

      <ul className="grid sm:grid-cols-2 gap-4">
        {data.map((g: any) => (
          <li key={g.id} className="rounded border border-slate-800 p-4 bg-slate-900">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-lg">{g.title}</h3>
              <SaveButton gigId={g.id} />
            </div>
            <p className="text-sm opacity-80 line-clamp-2">{g.description}</p>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span>{g.city ?? "—"}</span>
              <Link className="underline" href={`/gigs/${g.id}`}>View</Link>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-center gap-3">
        <button disabled={page<=1} onClick={()=>setPage(p=>Math.max(1,p-1))} className="px-3 py-1 rounded border border-slate-800 disabled:opacity-50">Prev</button>
        <span className="text-sm opacity-80">Page {page} / {pages}</span>
        <button disabled={page>=pages} onClick={()=>setPage(p=>Math.min(pages,p+1))} className="px-3 py-1 rounded border border-slate-800 disabled:opacity-50">Next</button>
      </div>
    </Shell>
  );
}
