'use client';
import { useState } from 'react';
import { mutate } from 'swr';
import PHCascade from '@/components/location/PHCascade';
import { useSubmitGuard } from '@/hooks/useSubmitGuard';

interface Loc { region?: string; province?: string; city?: string }

function validate(form: { title: string; description: string; loc: Loc }) {
  const errors: Record<string, string> = {};
  if (form.title.trim().length < 3 || form.title.trim().length > 120) {
    errors.title = 'Title must be 3-120 characters';
  }
  if (form.description.trim().length < 20) {
    errors.description = 'Description too short';
  }
  if (!form.loc.region) errors.region = 'Region required';
  if (!form.loc.province) errors.province = 'Province required';
  if (!form.loc.city) errors.city = 'City required';
  return errors;
}

export default function NewJobForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loc, setLoc] = useState<Loc>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);
  const { submitting, guard } = useSubmitGuard();

  const isValid = Object.keys(
    validate({ title, description, loc }),
  ).length === 0;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    guard(async () => {
      const errs = validate({ title, description, loc });
      setErrors(errs);
      if (Object.keys(errs).length) return;
      setServerError('');
      const res = await fetch('/api/jobs/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          region_code: loc.region,
          province_code: loc.province,
          city_code: loc.city,
        }),
      });
      if (res.ok) {
        await res.json().catch(() => null);
        mutate('credits');
        setSuccess(true);
      } else {
        const data = await res.json().catch(() => ({}));
        if (data.error?.fields) setErrors(data.error.fields);
        setServerError(data.error?.message || data.error?.code || 'Failed to post job');
      }
    });
  };

  if (success) {
    return <p>Job posted!</p>;
  }

  return (
    <form onSubmit={submit} className="space-y-3" data-testid="job-form">
      {serverError && (
        <p className="text-red-600 text-sm" aria-live="polite">
          {serverError}
        </p>
      )}
      <div>
        <label htmlFor="txt-title" className="block text-sm mb-1">
          Title
        </label>
        <input
          id="txt-title"
          data-testid="txt-title"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="border p-2 w-full"
        />
        {errors.title && (
          <p className="text-sm text-red-600" aria-live="polite">
            {errors.title}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="txt-description" className="block text-sm mb-1">
          Description
        </label>
        <textarea
          id="txt-description"
          data-testid="txt-description"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="border p-2 w-full"
        />
        {errors.description && (
          <p className="text-sm text-red-600" aria-live="polite">
            {errors.description}
          </p>
        )}
      </div>
      <PHCascade
        value={loc}
        onChange={(v) => {
          setLoc(v);
        }}
        required
      />
      {errors.region && (
        <p className="text-sm text-red-600" aria-live="polite">
          {errors.region}
        </p>
      )}
      {errors.province && (
        <p className="text-sm text-red-600" aria-live="polite">
          {errors.province}
        </p>
      )}
      {errors.city && (
        <p className="text-sm text-red-600" aria-live="polite">
          {errors.city}
        </p>
      )}
      <button
        type="submit"
        data-testid="btn-submit"
        className="px-4 py-2 bg-black text-white rounded disabled:opacity-50"
        disabled={submitting || !isValid}
      >
        {submitting ? 'Posting…' : 'Post'}
      </button>
    </form>
  );
}
