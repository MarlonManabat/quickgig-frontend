import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";

export default function Wallet() {
  const supabase = createClientComponentClient();
  const [rows, setRows] = useState<any[]>([]);
  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data: bal } = await supabase
        .from("tickets_balances")
        .select("balance")
        .eq("user_id", user.id)
        .maybeSingle();
      setBalance(bal?.balance ?? 0);
      const { data: ledger } = await supabase
        .from("tickets_ledger")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50);
      setRows(ledger ?? []);
    })();
  }, []);

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Wallet</h1>
      <div className="mb-4">
        Balance: <b>{balance}</b> tickets
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className="text-left">When</th>
            <th>Δ</th>
            <th className="text-left">Reason</th>
            <th className="text-left">Ref</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td>{new Date(r.created_at).toLocaleString()}</td>
              <td
                className={
                  r.delta >= 0
                    ? "text-green-600 text-right"
                    : "text-red-600 text-right"
                }
              >
                {r.delta}
              </td>
              <td className="pl-4">{r.reason}</td>
              <td className="pl-4">
                {r.ref_type} {r.ref_id ?? ""}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
