'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabaseClient';
import FormShell from '@/components/forms/FormShell';
import EmailField from '@/components/forms/EmailField';
import FieldRow from '@/components/forms/FieldRow';
import { focusFromQuery } from '@/utils/focusTarget';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    focusFromQuery('focus', { email: '#email' });
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    setError(null);
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      setError('May problema sa pagpapadala. Paki-try uli.');
    } else {
      setStatus(`Nagpadala kami ng Magic Link sa ${email}. I-open mo ang email mo at i-tap ang link para makapasok.`);
    }
    setLoading(false);
  }

  if (status) {
    return (
      <FormShell title="Mag-login / Sign up">
        <p>{status}</p>
      </FormShell>
    );
  }

  return (
    <FormShell title="Mag-login / Sign up">
      <form onSubmit={onSubmit} className="space-y-4">
        <FieldRow>
          <EmailField
            id="email"
            label="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />
        </FieldRow>
        <button
          type="submit"
          disabled={loading}
          aria-busy={loading}
          className="btn-primary w-full sm:w-auto h-11 rounded-xl"
        >
          {loading ? '...' : 'Send Magic Link'}
        </button>
        {error && <p className="text-sm text-[color:var(--text)]/80">{error}</p>}
      </form>
    </FormShell>
  );
}
