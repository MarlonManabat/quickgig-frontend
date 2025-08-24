import { useState } from 'react';
import { approvePayment, rejectPayment } from '@/lib/actions/adminPayments';
import { notifyPaymentApproved, notifyPaymentRejected } from '@/lib/notifyPayments';

export type PendingPayment = {
  id: string;
  user_id: string;
  amount_php: number;
  expected_tickets: number;
  gcash_reference: string;
  created_at: string;
};

export default function AdminPayments({ initial = [] }: { initial: PendingPayment[] }) {
  const [rows, setRows] = useState(initial);

  const handleApprove = async (id: string) => {
    await approvePayment(id);
    await notifyPaymentApproved(id);
    setRows((r) => r.filter((x) => x.id !== id));
    alert('Tickets credited.');
  };

  const handleReject = async (id: string) => {
    const reason = prompt('Reason for rejection?') || 'N/A';
    await rejectPayment(id, reason);
    await notifyPaymentRejected(id, reason);
    setRows((r) => r.filter((x) => x.id !== id));
    alert('Payment rejected.');
  };

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Pending payments</h1>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left">
            <th>ID</th>
            <th>User</th>
            <th>Amount</th>
            <th>Tickets</th>
            <th>GCash Ref</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((p) => (
            <tr key={p.id} className="border-t">
              <td>{p.id}</td>
              <td>{p.user_id}</td>
              <td>{p.amount_php}</td>
              <td>{p.expected_tickets}</td>
              <td>{p.gcash_reference}</td>
              <td className="space-x-2">
                <button
                  onClick={() => handleApprove(p.id)}
                  data-testid="approve-payment"
                  aria-label="Approve payment"
                  className="px-2 py-1 bg-green-600 text-white rounded"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(p.id)}
                  data-testid="reject-payment"
                  aria-label="Reject payment"
                  className="px-2 py-1 bg-red-600 text-white rounded"
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
