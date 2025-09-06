import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import Link from "next/link";
import { ROUTES } from "@/lib/routes";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

type LedgerRow = {
  id: string;
  created_at: string;
  user_id: string;
  delta: number;
  source: string | null;
  ref_id: string | null;
};

async function getData() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supa = createServerClient(url, anon, { cookies });

  const { data: auth } = await supa.auth.getUser();
  const uid = auth?.user?.id;
  if (!uid) return { uid: null, balance: 0, rows: [] as LedgerRow[] };

  // Balance via existing helper RPC or view; fallback to sum if helper absent.
  let balance = 0;
  const bal = await supa.rpc("tickets_balance", { p_user: uid } as any);
  if (!bal.error && typeof bal.data === "number") balance = bal.data;
  else {
    const agg = await supa
      .from("ticket_ledger")
      .select("delta", { count: "exact" })
      .eq("user_id", uid)
      .limit(1000);
    if (!agg.error && agg.data) balance = agg.data.reduce((a, r: any) => a + (r.delta || 0), 0);
  }

  const { data: rows = [] } = await supa
    .from("ticket_ledger")
    .select("id,created_at,user_id,delta,source,ref_id")
    .eq("user_id", uid)
    .order("created_at", { ascending: false })
    .limit(100);

  return { uid, balance, rows: rows as LedgerRow[] };
}

export default async function TicketsPage() {
  const { uid, balance, rows } = await getData();

  if (!uid) {
    return (
      <div className="p-6 space-y-4">
        <h1 className="text-2xl font-semibold">Tickets</h1>
        <p>Please sign in to view your tickets.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-baseline gap-3">
        <h1 className="text-2xl font-semibold">Tickets</h1>
        <span className="px-2 py-1 rounded bg-gray-100">Balance: <b>{balance}</b></span>
      </div>

      <div className="overflow-x-auto border rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-2">When</th>
              <th className="p-2">Δ</th>
              <th className="p-2">Source</th>
              <th className="p-2">Ref</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="p-2">{new Date(r.created_at).toLocaleString()}</td>
                <td className={`p-2 ${r.delta! > 0 ? "text-green-600" : r.delta! < 0 ? "text-red-600" : ""}`}>
                  {r.delta! > 0 ? `+${r.delta}` : r.delta}
                </td>
                <td className="p-2">{r.source ?? "—"}</td>
                <td className="p-2">
                  {r.ref_id ? (
                    <Link className="underline" href={`${ROUTES.agreements}/${r.ref_id}`}>{r.ref_id}</Link>
                  ) : "—"}
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={4} className="p-3 text-gray-500">No entries yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-500">
        Showing latest 100 entries. Contact support for older history.
      </p>
    </div>
  );
}

