import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { addEntry } from '@/lib/tickets';

type Row = { user_id: string; balance: number; entries: any[] };

export default function AdminTickets() {
  const [rows, setRows] = useState<Row[]>([]);

  async function load() {
    const { data: balances } = await supabase
      .from('tickets_balances')
      .select('user_id,balance');
    const list = await Promise.all(
      (balances ?? []).map(async b => {
        const { data: entries } = await supabase
          .from('tickets_ledger')
          .select('delta,reason,created_at')
          .eq('user_id', b.user_id)
          .order('created_at', { descending: true })
          .limit(10);
        return { user_id: b.user_id, balance: b.balance, entries: entries ?? [] };
      })
    );
    setRows(list);
  }

  useEffect(() => {
    load();
  }, []);

  async function credit(userId: string) {
    await addEntry(userId, 3, 'admin_adjust');
    load();
  }

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Tickets</h1>
      <table className="w-full border mb-6">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">User</th>
            <th className="p-2 text-left">Balance</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.user_id} className="border-t">
              <td className="p-2">{r.user_id}</td>
              <td className="p-2">{r.balance}</td>
              <td className="p-2">
                <button className="underline" onClick={() => credit(r.user_id)}>
                  + Credit 3 tickets
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {rows.map(r => (
        <div key={r.user_id} className="mb-6">
          <h2 className="font-semibold">{r.user_id} history</h2>
          <ul className="text-sm">
            {r.entries.map((e, idx) => (
              <li key={idx}>
                {e.created_at}: {e.delta} ({e.reason})
              </li>
            ))}
          </ul>
        </div>
      ))}
    </main>
  );
}
