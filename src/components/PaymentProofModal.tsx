'use client';
import React from 'react';
import { supabaseBrowser } from '@/lib/supabase/browser';
import { nanoid } from 'nanoid';

export default function PaymentProofModal({
  open,
  onClose,
  pricePHP,
  credits,
  next,
  onStart,
  onDone,
  onError,
}: {
  open: boolean;
  onClose: () => void;
  pricePHP: number;
  credits: number;
  next?: string;
  onStart?: () => void;
  onDone?: () => void;
  onError?: () => void;
}) {
  const supabase = supabaseBrowser;
  const [file, setFile] = React.useState<File | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const submit = async () => {
    if (!file) return;
    setBusy(true); setError(null);
    onStart?.();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError('Please sign in first.'); setBusy(false); onError?.(); return; }

    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
    const path = `proofs/${user.id}/${Date.now()}-${nanoid()}.${ext}`;
    const up = await supabase.storage.from('payments').upload(path, file);
    if (up.error) { setError(up.error.message); setBusy(false); onError?.(); return; }

    const res = await fetch('/api/orders/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: pricePHP, credits, proof_path: path, next })
    });
    if (!res.ok) { setError('Failed to create order'); setBusy(false); onError?.(); return; }

    onDone?.();
    setBusy(false);
    onClose();
    alert('Thanks! Your payment is under review.');
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4">
        <h2 className="text-xl font-semibold">Buy posting credits</h2>
        <p>Send <b>₱{pricePHP}</b> via GCash and upload the receipt.</p>
        {process.env.NEXT_PUBLIC_GCASH_QR_URL && (
          <img src={process.env.NEXT_PUBLIC_GCASH_QR_URL} alt="GCash QR" className="w-48 h-48 mx-auto rounded" />
        )}
        <input type="file" accept="image/*" onChange={(e)=>setFile(e.target.files?.[0] || null)} />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex gap-2 justify-end">
          <button className="px-3 py-2 rounded-xl border" onClick={onClose} disabled={busy}>Cancel</button>
          <button className="px-3 py-2 rounded-xl bg-black text-white" onClick={submit} disabled={!file || busy}>Submit</button>
        </div>
      </div>
    </div>
  );
}

