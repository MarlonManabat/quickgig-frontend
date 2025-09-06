"use client";

import { useEffect, useMemo, useState } from "react";

type Row = {
  id: string;
  created_at: string;
  user_id: string;
  delta: number;
  source: string | null;
  ref_id: string | null;
};

export default function AdminTicketsPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [meAdmin, setMeAdmin] = useState<boolean | null>(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    (async () => {
      // whoami
      const me = await fetch("/api/me").then(r => r.ok ? r.json() : null).catch(() => null);
      // allow if profile.is_admin || app_metadata.role === 'admin'
      const isAdmin = !!(me?.profile?.is_admin || me?.user?.app_metadata?.role === "admin");
      setMeAdmin(isAdmin);
      if (!isAdmin) return;

      const list = await fetch("/api/admin/tickets/list?limit=200").then(r => r.json());
      setRows(list?.rows ?? []);
    })();
  }, []);

  const filtered = useMemo(() => {
    if (!q) return rows;
    const s = q.toLowerCase();
    return rows.filter(r =>
      r.user_id.toLowerCase().includes(s) ||
      (r.source ?? "").toLowerCase().includes(s) ||
      (r.ref_id ?? "").toLowerCase().includes(s)
    );
  }, [rows, q]);

  if (meAdmin === null) return <div className="p-6">Loading…</div>;
  if (!meAdmin) return <div className="p-6">Forbidden.</div>;

  const total = rows.reduce((a, r) => a + (r.delta || 0), 0);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-baseline gap-4">
        <h1 className="text-2xl font-semibold">Admin · Ticket ledger</h1>
        <span className="px-2 py-1 rounded bg-gray-100 text-sm">
          Loaded: {rows.length} · Net Δ: {total >= 0 ? `+${total}` : total}
        </span>
        <input
          placeholder="Filter: user_id / source / ref"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="border rounded px-2 py-1 text-sm flex-1"
        />
      </div>

      <div className="overflow-x-auto border rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-2">When</th>
              <th className="p-2">User</th>
              <th className="p-2">Δ</th>
              <th className="p-2">Source</th>
              <th className="p-2">Ref</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="p-2">{new Date(r.created_at).toLocaleString()}</td>
                <td className="p-2 font-mono text-[11px]">{r.user_id}</td>
                <td className={`p-2 ${r.delta! > 0 ? "text-green-600" : r.delta! < 0 ? "text-red-600" : ""}`}>
                  {r.delta! > 0 ? `+${r.delta}` : r.delta}
                </td>
                <td className="p-2">{r.source ?? "—"}</td>
                <td className="p-2 font-mono text-[11px]">{r.ref_id ?? "—"}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="p-3 text-gray-500">No matching rows.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

