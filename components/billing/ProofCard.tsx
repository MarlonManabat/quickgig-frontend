import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/db';

interface Proof {
  id: string;
  user_id: string;
  amount: number;
  credits: number;
  file_url: string;
  note?: string | null;
  status: string;
  created_at: string;
  user_email?: string | null;
}

export default function ProofCard({ proof, children }: { proof: Proof; children?: React.ReactNode }) {
  const supabase = createClientComponentClient<Database>();
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    const { data } = supabase.storage.from('gcash-proofs').getPublicUrl(proof.file_url);
    setUrl(data.publicUrl);
  }, [proof.file_url, supabase]);

  const isImage = proof.file_url.match(/\.png$|\.jpg$|\.jpeg$/i);

  return (
    <div className="border rounded p-4 space-y-2">
      {url && (
        isImage ? (
          <img src={url} alt="proof" className="h-32 object-contain" />
        ) : (
          <a href={url} target="_blank" rel="noreferrer" className="underline">
            View file
          </a>
        )
      )}
      <p>Amount: ₱{proof.amount}</p>
      <p>Credits: {proof.credits}</p>
      {proof.user_email && <p>User: {proof.user_email}</p>}
      <p>Status: {proof.status}</p>
      <p className="text-xs text-gray-500">
        Submitted: {new Date(proof.created_at).toLocaleString()}
      </p>
      {children}
    </div>
  );
}
