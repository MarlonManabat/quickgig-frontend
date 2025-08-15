'use client';

import { useState, useEffect } from 'react';
import { Input, Textarea, Select } from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { api } from '@/lib/apiClient';
import { API } from '@/config/api';
import { toast } from '@/lib/toast';

const sizeOptions = [
  { value: '1-10', label: '1-10' },
  { value: '11-50', label: '11-50' },
  { value: '51-200', label: '51-200' },
  { value: '200+', label: '200+' },
];

export default function EmployerCompanyPage() {
  const [data, setData] = useState({
    companyName: '',
    slug: '',
    website: '',
    location: '',
    about: '',
    size: '',
    industry: '',
  });
  const [logo, setLogo] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(API.companyGet);
        const d = res.data || {};
        setData({
          companyName: d.companyName || d.name || '',
          slug: d.slug || '',
          website: d.website || '',
          location: d.location || '',
          about: d.about || '',
          size: d.size || '',
          industry: d.industry || '',
        });
        if (d.logo) setLogo(d.logo);
      } catch {
        /* ignore */
      }
    })();
  }, []);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setData({ ...data, [field]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post(API.companyUpdate, data);
      toast('Company saved');
    } catch {
      toast('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast('File too large (max 10 MB)');
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload/logo', { method: 'POST', body: formData });
      const json = await res.json();
      if (json.ok) {
        setLogo(json.url || '');
        toast('Logo uploaded');
      } else {
        toast(json.message || 'Upload failed');
      }
    } catch {
      toast('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="p-4 space-y-6 max-w-2xl">
      <h1 className="text-xl font-semibold">Company</h1>
      <form onSubmit={handleSave} className="space-y-4">
        <Input label="Name" value={data.companyName} onChange={handleChange('companyName')} />
        <Input label="Slug" value={data.slug} onChange={handleChange('slug')} />
        <Input label="Website" value={data.website} onChange={handleChange('website')} />
        <Input label="Location" value={data.location} onChange={handleChange('location')} />
        <Select
          label="Size"
          value={data.size}
          onChange={handleChange('size')}
          options={sizeOptions}
          placeholder="Select size"
        />
        <Input label="Industry" value={data.industry} onChange={handleChange('industry')} />
        <Textarea label="About" value={data.about} onChange={handleChange('about')} />
        <Button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </form>
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Logo</h2>
        {logo && <img src={logo} alt="Company logo" className="max-h-32" />}
        <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={handleUpload} />
        {uploading && <p>Uploading...</p>}
      </div>
    </main>
  );
}
