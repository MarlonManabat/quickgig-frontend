'use client';
import React from 'react';
import LocationSelect from '@/components/LocationSelect';

export default function PostJobPage() {
  const [form, setForm] = React.useState({ title:'', description:'', region_code:'', city_code:'', budget:'' });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, just log; PR3 will wire RPC + credits
    console.log('submit', form);
    alert('Demo: form captured (backend wiring in PR3).');
  };

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-4 min-h-[60vh]">
      <h1 className="text-2xl font-semibold">Post a Job</h1>
      <form onSubmit={submit} className="space-y-3">
        <input className="border rounded-xl p-2 w-full" placeholder="Title" value={form.title}
               onChange={e=>setForm(f=>({...f, title:e.target.value}))}/>
        <textarea className="border rounded-xl p-2 w-full" placeholder="Description" value={form.description}
                  onChange={e=>setForm(f=>({...f, description:e.target.value}))}/>
        <LocationSelect
          value={{ region_code: form.region_code, city_code: form.city_code }}
          onChange={(v)=>setForm(f=>({...f, ...v}))}
        />
        <input className="border rounded-xl p-2 w-full" placeholder="Budget (optional)" inputMode="numeric"
               value={form.budget} onChange={e=>setForm(f=>({...f, budget:e.target.value}))}/>
        <button className="px-4 py-2 rounded-xl bg-black text-white">Create</button>
      </form>
    </main>
  );
}
