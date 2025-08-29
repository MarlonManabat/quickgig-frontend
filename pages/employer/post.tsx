'use client';
import React from 'react';
import LocationSelect from '@/components/LocationSelect';
import PaymentProofModal from '@/components/PaymentProofModal';

export default function PostJobPage() {
  const [form, setForm] = React.useState({ title:'', description:'', region_code:'', city_code:'', budget:'' });
  const [buyOpen, setBuyOpen] = React.useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/gigs/create', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({
        ...form,
        budget: form.budget ? Number(form.budget) : null,
      }),
    });
    if (res.status === 402) { setBuyOpen(true); return; }
    if (!res.ok) { alert('Failed to create gig'); return; }
    const { gig_id } = await res.json();
    window.location.href = `/find`; // or `/gigs/${gig_id}` once detail page exists
  };

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-4 min-h-[60vh]">
      <h1 className="text-2xl font-semibold">Post a Job</h1>
      <form onSubmit={submit} className="space-y-3">
        <input className="border rounded-xl p-2 w-full" placeholder="Title"
               value={form.title} onChange={e=>setForm(f=>({...f, title:e.target.value}))}/>
        <textarea className="border rounded-xl p-2 w-full" placeholder="Description"
                  value={form.description} onChange={e=>setForm(f=>({...f, description:e.target.value}))}/>
        <LocationSelect value={{ region_code: form.region_code, city_code: form.city_code }}
                        onChange={(v)=>setForm(f=>({...f, ...v}))}/>
        <input className="border rounded-xl p-2 w-full" placeholder="Budget (optional)" inputMode="numeric"
               value={form.budget} onChange={e=>setForm(f=>({...f, budget:e.target.value}))}/>
        <button className="px-4 py-2 rounded-xl bg-black text-white">Create</button>
      </form>

      <PaymentProofModal
        open={buyOpen}
        onClose={()=>setBuyOpen(false)}
        pricePHP={Number(process.env.NEXT_PUBLIC_TICKET_PRICE_PHP || 99)}
        credits={3}
      />
    </main>
  );
}
