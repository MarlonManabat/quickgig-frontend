import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import Shell from "@/components/Shell";
import Link from "next/link";
import SaveButton from "@/components/SaveButton";
import LocationSelect from "@/components/LocationSelect";

const PAGE_SIZE = 12;

export default function FindWorkPage() {
  const [q, setQ] = useState("");
  const [loc, setLoc] = useState<{ region_code: string; city_code: string }>({ region_code: "", city_code: "" });
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
      let query = supabase
        .from("gigs")
        .select("*", { count: "exact" })
        .neq("hidden", true);

      if (q.trim()) {
        query = query.ilike("title", `%${q}%`).or(`description.ilike.%${q}%`);
      }
      if (loc.city_code) query = query.eq("city_code", loc.city_code);
      else if (loc.region_code) query = query.eq("region_code", loc.region_code);
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
    return () => {
      ignore = true;
    };
  }, [q, loc.region_code, loc.city_code, minBudget, maxBudget, page]);

  const total = count;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <Shell>
      <h1 className="text-2xl font-bold mb-4">Latest Gigs</h1>

      <div className="mb-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search title/description"
          className="input"
        />
        <LocationSelect value={loc} onChange={(v) => setLoc((p) => ({ ...p, ...v }))} />
        <input
          value={minBudget}
          onChange={(e) => setMinBudget(e.target.value)}
          placeholder="Min budget"
          className="input"
        />
        <input
          value={maxBudget}
          onChange={(e) => setMaxBudget(e.target.value)}
          placeholder="Max budget"
          className="input"
        />
      </div>

      {loading && <p>Loading…</p>}
      {error && <p className="text-brand-danger">{error.message}</p>}

      <ul className="grid sm:grid-cols-2 gap-4">
        {data.map((g: any) => (
          <li key={g.id} className="card p-4">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-lg">{g.title}</h3>
              <SaveButton gigId={g.id} />
            </div>
            <p className="text-sm text-brand-subtle line-clamp-2">
              {g.description}
            </p>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span>{g.city_code ?? "—"}</span>
              <Link className="underline" href={`/gigs/${g.id}`} prefetch>
                View
              </Link>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-center gap-3">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="px-3 py-1 rounded border border-brand-border disabled:opacity-50"
        >
          Prev
        </button>
        <span className="text-sm text-brand-subtle">
          Page {page} / {pages}
        </span>
        <button
          disabled={page >= pages}
          onClick={() => setPage((p) => Math.min(pages, p + 1))}
          className="px-3 py-1 rounded border border-brand-border disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </Shell>
  );
}

export async function getStaticProps() {
  return { props: {}, revalidate: 60 };
}
