import { useEffect, useState } from 'react';
import Head from 'next/head';
import type { GetServerSideProps } from 'next';
import type { CompanyProfile } from '@/types/company';
import { getCompany, updateCompany } from '@/lib/employerStore';
import { toast } from '@/lib/toast';

export const getServerSideProps: GetServerSideProps = async () => ({ props: {} });

export default function EmployerCompanyPage() {
  const [form, setForm] = useState<CompanyProfile | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getCompany().then((c) => setForm(c || { id: '1', name: '', updatedAt: new Date().toISOString() }));
  }, []);

  const handleChange = (
    field: keyof CompanyProfile,
  ) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (!form) return;
      setForm({ ...form, [field]: e.target.value });
    };

  const handleLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm((f) => (f ? { ...f, logoUrl: String(reader.result) } : f));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    try {
      const updated = await updateCompany(form);
      setForm(updated);
      toast('Saved');
    } catch {
      toast('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (!form) return <main className="p-4">Loading...</main>;

  return (
    <>
      <Head>
        <title>Company profile | QuickGig</title>
      </Head>
      <main className="p-4 space-y-4 max-w-xl">
        <h1 className="text-xl font-semibold">Company Profile</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Name</label>
            <input
              className="border p-2 w-full"
              value={form.name}
              onChange={handleChange('name')}
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Website</label>
            <input
              className="border p-2 w-full"
              value={form.website || ''}
              onChange={handleChange('website')}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              className="border p-2 w-full"
              value={form.email || ''}
              onChange={handleChange('email')}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Phone</label>
            <input
              className="border p-2 w-full"
              value={form.phone || ''}
              onChange={handleChange('phone')}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Location</label>
            <input
              className="border p-2 w-full"
              value={form.location || ''}
              onChange={handleChange('location')}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">About</label>
            <textarea
              className="border p-2 w-full"
              value={form.about || ''}
              onChange={handleChange('about')}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Logo</label>
            {form.logoUrl && (
              <img src={form.logoUrl} alt="logo" className="h-16 mb-2" />
            )}
            <input type="file" accept="image/*" onChange={handleLogo} />
          </div>
          <button
            type="submit"
            className="bg-qg-accent text-white px-4 py-2 rounded"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </form>
      </main>
    </>
  );
}
