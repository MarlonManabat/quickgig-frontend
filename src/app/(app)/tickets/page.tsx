import Link from 'next/link';
import { ROUTES } from '@/lib/routes';
import { requireUser } from '@/app/(app)/_lib/requireUser';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

type LedgerRow = {
  id: string;
  created_at: string;
  user_id: string;
  delta: number;
  source: string | null;
  ref_id: string | null;
};

export default async function TicketsPage() {
  const { supabase, user } = await requireUser();

  let balance = 0;
  const bal = await supabase.rpc('tickets_balance', { p_user: user.id } as any);
  if (!bal.error && typeof bal.data === 'number') balance = bal.data;

  const { data: rows = [] } = await supabase
    .from('ticket_ledger')
    .select('id,created_at,user_id,delta,source,ref_id')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(100);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold">Tickets</h1>
        <span className="px-2 py-1 rounded bg-gray-100">Balance: <b>{balance}</b></span>
        <Link href={ROUTES.ticketsBuy} data-cta="buy-tickets" className="ml-auto text-sm underline">
          Buy ticket
        </Link>
      </div>

      {rows.length > 0 ? (
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
                  <td className={`p-2 ${r.delta! > 0 ? 'text-green-600' : r.delta! < 0 ? 'text-red-600' : ''}`}>
                    {r.delta! > 0 ? `+${r.delta}` : r.delta}
                  </td>
                  <td className="p-2">{r.source ?? '—'}</td>
                  <td className="p-2">
                    {r.ref_id ? (
                      <Link className="underline" href={`${ROUTES.agreements}/${r.ref_id}`}>{r.ref_id}</Link>
                    ) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div data-testid="tickets-empty" className="opacity-70 space-y-3">
          <p>No tickets yet.</p>
          <Link href={ROUTES.ticketsBuy} data-testid="buy-ticket" data-cta="buy-ticket" className="underline">
            Buy ticket
          </Link>
        </div>
      )}

      <p className="text-xs text-gray-500">Showing latest 100 entries. Contact support for older history.</p>
    </div>
  );
}
