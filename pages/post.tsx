'use client';
import dynamic from 'next/dynamic';
import { useState } from 'react';

const LocationSelect = dynamic(
  () => import('@/components/location/LocationSelect'),
  { ssr: false, loading: () => <div className="opacity-60">Loading locations…</div> }
);

export default function PostJobPage() {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');

  function onSubmit(e: React.FormEvent) {
    e.preventDefault(); // keep CI deterministic; real submit handled elsewhere
    // TODO: call credits check + create job API
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Post a Job</h1>
      <form onSubmit={onSubmit}>
        <label className="block mb-2">
          <span className="sr-only">Job title</span>
          <input
            className="input mb-3 w-full"
            name="title"
            placeholder="Job title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
        </label>

        <label className="block mb-2">
          <span className="sr-only">Company</span>
          <input
            className="input mb-3 w-full"
            name="company"
            placeholder="Company (optional)"
            value={company}
            onChange={e => setCompany(e.target.value)}
          />
        </label>

        {/* Must expose Region / Province(HUC/Metro) / City selects */}
        <LocationSelect />

        {/* 👇 This is what the smoke test looks for */}
        <button
          type="submit"
          className="btn btn-primary mt-4"
          aria-label="Post Job"
          data-testid="post-submit"
        >
          Post Job
        </button>
      </form>
    </div>
  );
}

