'use client';
import { useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { copy } from '@/copy';
import FormShell from '@/components/FormShell';
import EmailField from '@/components/fields/EmailField';

export default function AuthForm({ mode }: { mode: 'login' | 'signup' }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user)
          await fetch('/api/profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ full_name: fullName }),
          });
        setMsg('Check your email to confirm your account.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        window.location.href = '/dashboard';
      }
    } catch (err: any) {
      setMsg(err.message ?? 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <FormShell title={mode === 'signup' ? copy.auth.signupTitle : copy.auth.loginTitle}>
      <form onSubmit={onSubmit} className="space-y-3">
        {mode === 'signup' && (
          <input
            required
            className="input"
            placeholder={copy.profile.fullName}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        )}
        <EmailField
          required
          label={copy.auth.email}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            {copy.auth.password}
          </label>
          <input
            id="password"
            required
            type="password"
            className="w-full text-base md:text-lg leading-6 px-3 py-3 border rounded-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button disabled={loading} className="btn-primary w-full">
          {loading ? 'Please wait…' : mode === 'signup' ? copy.auth.signup : copy.auth.login}
        </button>
        {msg && <p className="text-sm text-brand-danger">{msg}</p>}
      </form>
    </FormShell>
  );
}
