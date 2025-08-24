import { useState } from 'react';
import { submitReceipt } from '@/lib/actions/createPayment';

export default function WalletPage() {
  const [amountPhp, setAmountPhp] = useState('');
  const [gcashRef, setGcashRef] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await submitReceipt({ amountPhp: Number(amountPhp), gcashRef });
      alert('Receipt submitted. Pending admin review.');
      setAmountPhp('');
      setGcashRef('');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Buy tickets</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <label className="block">
          <span className="text-sm">Amount (PHP)</span>
          <input
            className="border rounded w-full p-2"
            type="number"
            value={amountPhp}
            onChange={(e) => setAmountPhp(e.target.value)}
            required
          />
        </label>
        <label className="block">
          <span className="text-sm">GCash reference</span>
          <input
            className="border rounded w-full p-2"
            value={gcashRef}
            onChange={(e) => setGcashRef(e.target.value)}
            required
          />
        </label>
        <button
          type="submit"
          data-testid="submit-receipt"
          className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
          disabled={loading}
          aria-label="Submit receipt"
        >
          Submit
        </button>
      </form>
    </main>
  );
}

