'use client';
import { useState } from 'react';
import apiClient from '@/lib/apiClient';
import { API } from '@/config/api';
import { env } from '@/config/env';

export default function ApplyButton({ jobId }: { jobId: string }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  if (!env.NEXT_PUBLIC_ENABLE_APPLY) {
    return (
      <button
        className="bg-yellow-400 rounded px-3 py-1"
        onClick={() => alert('Applications are handled manually during beta.')}
      >
        Apply
      </button>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.post(API.apply, { jobId, name, email, phone, note });
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button className="bg-yellow-400 rounded px-3 py-1" onClick={() => setOpen(true)}>
        Apply
      </button>
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <form onSubmit={submit} className="bg-white p-4 rounded space-y-2 w-80">
            <h2 className="text-lg font-semibold">Apply</h2>
            <input className="w-full border p-1" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} required />
            <input className="w-full border p-1" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
            <input className="w-full border p-1" placeholder="Phone" value={phone} onChange={e=>setPhone(e.target.value)} />
            <textarea className="w-full border p-1" placeholder="Note" value={note} onChange={e=>setNote(e.target.value)} />
            <div className="flex justify-end space-x-2 pt-2">
              <button type="button" className="px-3 py-1" onClick={() => setOpen(false)} disabled={loading}>Cancel</button>
              <button type="submit" className="bg-yellow-400 px-3 py-1 rounded" disabled={loading}>
                {loading ? 'Sending...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
