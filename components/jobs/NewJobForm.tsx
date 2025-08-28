'use client';
import { useState } from 'react';
import PHCascade from '@/components/location/PHCascade';
import { createJob } from '@/lib/jobs';

export default function NewJobForm({ onCreated }: { onCreated?: () => void }) {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [isOnline, setIsOnline] = useState(false);
  const [location, setLocation] = useState<{ region?: string; province?: string; city?: string }>({});
  const [address, setAddress] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: any) {
    e.preventDefault();
    if (!isOnline && (!location.region || !location.province || !location.city)) {
      alert('Complete location required');
      return;
    }
    setBusy(true);
    try {
      await createJob({
        title: title.trim(),
        company: company.trim() || undefined,
        is_online: isOnline,
        region: isOnline ? null : location.region || null,
        province: isOnline ? null : location.province || null,
        city: isOnline ? null : location.city || null,
        address: isOnline ? null : address.trim() || null,
      });
      onCreated?.();
    } catch (err) {
      console.error(err);
      alert('Could not save job');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <input
        className="w-full border rounded p-2"
        placeholder="Job title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        className="w-full border rounded p-2"
        placeholder="Company (optional)"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
      />
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={isOnline}
          onChange={(e) => setIsOnline(e.target.checked)}
        />
        Online Job
      </label>
      <PHCascade value={location} onChange={setLocation} required={!isOnline} />
      <p className="text-xs text-gray-500">Select Region → Province → City/Municipality</p>
      <input
        className="border rounded p-2"
        placeholder="Address (optional)"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        disabled={isOnline}
      />
      <button
        className="qg-btn qg-btn--primary px-4 py-2"
        disabled={busy}
      >
        {busy ? 'Saving...' : 'Post Job'}
      </button>
    </form>
  );
}
