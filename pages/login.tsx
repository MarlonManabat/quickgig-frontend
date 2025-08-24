'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/utils/supabaseClient';
import FormShell from '@/components/forms/FormShell';
import EmailField from '@/components/ui/EmailField';
import FieldRow from '@/components/forms/FieldRow';
import { focusFromQuery } from '@/utils/focusTarget';
import { toast } from '@/utils/toast';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    focusFromQuery('focus', { email: '#email' });
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    setError(null);
    const next = router.query?.next as string | undefined;
    const role = router.query?.role as string | undefined;
    try {
      const qp = new URLSearchParams();
      if (next) qp.set('next', next);
      if (role) qp.set('role', role);
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${location.origin}/auth/callback${qp.toString() ? `?${qp.toString()}` : ''}`,
          shouldCreateUser: true,
        },
      });
      if (error) throw error;
      toast.success('Magic link sent! Please check your email.');
      setStatus(
        `Nagpadala kami ng Magic Link sa ${email}. I-open mo ang email mo at i-tap ang link para makapasok.`
      );
      setTimeout(() => setStatus(null), 30000);
    } catch (err: any) {
      const msg = err.message || 'Hindi valid ang login—paki-check ang email mo.';
      setError(msg);
      toast.error(msg);
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
            value={email}
            onChange={setEmail}
            error={error || undefined}
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
      </form>
    </FormShell>
  );
}
