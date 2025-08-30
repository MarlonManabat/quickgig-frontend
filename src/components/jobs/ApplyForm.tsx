'use client';
import { useState } from 'react';
import { useSubmitGuard } from '@/hooks/useSubmitGuard';

export default function ApplyForm({ jobId }: { jobId: string }) {
  const [message, setMessage] = useState('');
  const [rate, setRate] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');
  const { submitting, guard } = useSubmitGuard();

  const validate = () => {
    const field: Record<string, string> = {};
    if (message.trim().length < 20) field.message = 'Message too short';
    const r = Number(rate);
    if (!r || r <= 0) field.expectedRate = 'Rate must be > 0';
    return { field, r };
  };

  const isValid = message.trim().length >= 20 && Number(rate) > 0;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    guard(async () => {
      const { field, r } = validate();
      setErrors(field);
      if (Object.keys(field).length) return;
      setServerError('');
      const res = await fetch('/api/applications/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId, message: message.trim(), expectedRate: r }),
      });
      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        window.location.href = `/applications/${data.id}`;
      } else {
        const data = await res.json().catch(() => ({}));
        if (data.error?.fields) setErrors(data.error.fields);
        setServerError(data.error?.code || 'Failed to apply');
      }
    });
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      {serverError && (
        <p className="text-sm text-red-600" aria-live="polite">
          {serverError === 'JOB_CLOSED'
            ? 'Applications closed'
            : serverError === 'DUPLICATE_APPLICATION'
            ? 'You already applied to this job'
            : serverError}
        </p>
      )}
      <div>
        <label htmlFor="txt-message" className="block text-sm mb-1">
          Message
        </label>
        <textarea
          id="txt-message"
          data-testid="txt-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border p-2 w-full"
          aria-invalid={!!errors.message}
        />
        {errors.message && (
          <p className="text-sm text-red-600" aria-live="polite">
            {errors.message}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="txt-rate" className="block text-sm mb-1">
          Expected rate
        </label>
        <input
          id="txt-rate"
          type="number"
          data-testid="txt-rate"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
          className="border p-2 w-full"
          aria-invalid={!!errors.expectedRate}
        />
        {errors.expectedRate && (
          <p className="text-sm text-red-600" aria-live="polite">
            {errors.expectedRate}
          </p>
        )}
      </div>
      <button
        type="submit"
        data-testid="btn-apply"
        className="px-4 py-2 bg-black text-white rounded disabled:opacity-50"
        disabled={submitting || !isValid}
      >
        {submitting ? 'Applying…' : 'Apply'}
      </button>
    </form>
  );
}
