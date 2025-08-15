'use client';
import { useState } from 'react';
import axios from 'axios';
import { api } from '@/lib/apiClient';
import { API } from '@/config/api';
import { env } from '@/config/env';
import { toast } from '@/lib/toast';

interface ApplyProps {
  jobId: string;
  title: string;
}

export default function ApplyButton({ jobId, title }: ApplyProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFallback, setShowFallback] = useState(false);

  const emailInvalid =
    email !== '' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);

  if (!env.NEXT_PUBLIC_ENABLE_APPLY) {
    return (
      <span className="text-sm text-gray-500">
        Applications handled manually during beta.
      </span>
    );
  }

  const reset = () => {
    setName('');
    setEmail('');
    setPhone('');
    setNote('');
    setError(null);
    setShowFallback(false);
    setSubmitted(false);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || emailInvalid) {
      setError('Please provide your name and a valid email.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await api.post(API.apply, { jobId, name, email, phone, note });
      try {
        await fetch('/api/notify/application', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            applicantEmail: email,
            applicantName: name,
            jobTitle: title,
            applicationId: res.data?.id ?? res.data?.applicationId,
            employerEmail: res.data?.employerEmail,
          }),
        });
      } catch (err) {
        console.warn('notify failed', err);
      }
      toast('Application submitted');
      setSubmitted(true);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const status = err.response.status;
        if (status === 401) {
          window.location.href = '/login';
          return;
        }
        if ([404, 500, 501].includes(status)) {
          setError('Unable to submit application.');
          setShowFallback(true);
        } else {
          setError('Failed to submit application');
        }
      } else {
        setError('Failed to submit application');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        className="bg-yellow-400 rounded px-3 py-1"
        onClick={() => {
          setOpen(true);
          reset();
        }}
      >
        Apply
      </button>
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          {submitted ? (
            <div className="bg-white p-4 rounded space-y-4 w-80 text-center">
              <p>Application submitted!</p>
              <button
                className="bg-gray-200 px-3 py-1 rounded cursor-not-allowed"
                disabled
              >
                View my applications (soon)
              </button>
              <button className="px-3 py-1" onClick={() => setOpen(false)}>
                Close
              </button>
            </div>
          ) : (
            <form
              onSubmit={submit}
              className="bg-white p-4 rounded space-y-2 w-80"
            >
              <h2 className="text-lg font-semibold">Apply</h2>
              <input
                className="w-full border p-1"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                className="w-full border p-1"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {emailInvalid && (
                <p className="text-sm text-red-500">Enter a valid email.</p>
              )}
              <input
                className="w-full border p-1"
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <textarea
                className="w-full border p-1"
                placeholder="Note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
              {error && (
                <p className="text-sm text-red-500">
                  {error}{' '}
                  {showFallback && (
                    <a
                      href={`mailto:?subject=${encodeURIComponent(
                        `Application for ${title}`,
                      )}`}
                      className="underline"
                    >
                      Apply via email
                    </a>
                  )}
                </p>
              )}
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  className="px-3 py-1"
                  onClick={() => setOpen(false)}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-yellow-400 px-3 py-1 rounded"
                  disabled={loading || emailInvalid}
                >
                  {loading ? 'Sending...' : 'Submit'}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </>
  );
}

