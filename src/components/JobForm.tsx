'use client';

import { useState } from 'react';
import Checkout from './payments/Checkout';
import { flags } from '@/lib/flags';

export interface JobFormData {
  title: string;
  description: string;
  location: string;
  payRange: string;
  tags: string[];
  published: boolean;
}

interface JobFormProps {
  initial?: JobFormData;
  onSubmit: (data: JobFormData) => Promise<void>;
}

export default function JobForm({ initial, onSubmit }: JobFormProps) {
  const [title, setTitle] = useState(initial?.title || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [location, setLocation] = useState(initial?.location || '');
  const [payRange, setPayRange] = useState(initial?.payRange || '');
  const [tags, setTags] = useState(initial?.tags?.join(', ') || '');
  const [published, setPublished] = useState(initial?.published || false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await onSubmit({
        title,
        description,
        location,
        payRange,
        tags: tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        published,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to submit';
      setError(message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded p-2"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border rounded p-2 h-32"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Location</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full border rounded p-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Pay Range</label>
        <input
          type="text"
          value={payRange}
          onChange={(e) => setPayRange(e.target.value)}
          className="w-full border rounded p-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full border rounded p-2"
        />
      </div>
      <div className="flex items-center space-x-2">
        <input
          id="published"
          type="checkbox"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
        />
        <label htmlFor="published">Published</label>
      </div>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <button
        type="submit"
        className="bg-qg-accent text-white px-4 py-2 rounded"
      >
        {initial ? 'Update Job' : 'Create Job'}
      </button>
      {flags.payments && (
        <div className="mt-4">
          <Checkout amount={0} />
        </div>
      )}
    </form>
  );
}
