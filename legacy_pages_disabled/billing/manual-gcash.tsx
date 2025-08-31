import { useState } from 'react';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database, Insert } from '@/types/db';
import { PRICE_PER_CREDIT, MAX_PROOF_SIZE_MB, ALLOWED_PROOF_TYPES } from '@/config/billing';
import { uploadProof } from '@/lib/storage';

export default function ManualGCashPage() {
  const supabase = createClientComponentClient<Database>();
  const [amount, setAmount] = useState('');
  const [credits, setCredits] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  function onAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    setAmount(v);
    const num = Number(v || '0');
    setCredits(Math.floor(num / PRICE_PER_CREDIT));
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] || null;
    if (f) {
      if (!ALLOWED_PROOF_TYPES.includes(f.type)) {
        setError('Invalid file type');
        return;
      }
      if (f.size > MAX_PROOF_SIZE_MB * 1024 * 1024) {
        setError('File too large');
        return;
      }
    }
    setError('');
    setFile(f);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file || credits < 1) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const file_url = await uploadProof(file, user.id);
    await supabase
      .from('payment_proofs')
      .insert([
        {
          user_id: user.id,
          amount: Number(amount),
          credits,
          file_url,
          note: note || null,
          status: 'pending',
        } satisfies Insert<'payment_proofs'>,
      ]);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <main className="max-w-xl mx-auto p-6 space-y-4 text-center">
        <p>Submitted for review</p>
        <Link href="/billing/history" className="underline">
          View history
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Manual GCash Top-up</h1>
      <p>Price per credit: ₱{PRICE_PER_CREDIT}</p>
      <form onSubmit={onSubmit} className="space-y-4">
        <label className="block">
          <span className="text-sm">Amount (₱)</span>
          <input
            type="number"
            min="0"
            value={amount}
            onChange={onAmountChange}
            className="input w-full"
            required
          />
        </label>
        <p>Credits: {credits}</p>
        <label className="block">
          <span className="text-sm">Upload proof</span>
          <input type="file" accept={ALLOWED_PROOF_TYPES.join(',')} onChange={onFileChange} />
        </label>
        <label className="block">
          <span className="text-sm">Note (optional)</span>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="input w-full"
          />
        </label>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          className="qg-btn qg-btn--primary"
          disabled={!file || credits < 1}
        >
          Submit
        </button>
      </form>
    </main>
  );
}
