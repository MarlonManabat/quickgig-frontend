'use client';
import { useState } from 'react';
import { supabase } from '@/utils/supabaseClient';

export default function AuthPage() {
  const [mode, setMode] = useState<'login'|'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setMsg(null);
    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setMsg('Logged in. You can now create/edit gigs.');
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMsg('Signed up. Check email if confirmation is required.');
      }
    } catch (err:any) {
      setMsg(err.message ?? 'Auth error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{maxWidth:520,margin:'40px auto',padding:'16px'}}>
      <h1>{mode === 'login' ? 'Log in' : 'Sign up'}</h1>
      <form onSubmit={onSubmit}>
        <label>Email<br/><input type="email" value={email} onChange={e=>setEmail(e.target.value)} required /></label><br/>
        <label>Password<br/><input type="password" value={password} onChange={e=>setPassword(e.target.value)} required /></label><br/>
        <button type="submit" disabled={loading}>{loading?'Working…': (mode==='login'?'Log in':'Sign up')}</button>
      </form>
      <p style={{marginTop:12}}>
        {mode==='login' ? 'No account?' : 'Have an account?'}{' '}
        <button onClick={()=>setMode(mode==='login'?'signup':'login')}>
          {mode==='login' ? 'Sign up' : 'Log in'}
        </button>
      </p>
      {msg && <p style={{marginTop:12}}>{msg}</p>}
    </main>
  );
}
