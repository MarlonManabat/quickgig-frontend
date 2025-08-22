import { useEffect, useState } from 'react';
import Shell from '@/components/Shell';
import { supabase } from '@/utils/supabaseClient';
import { isAdminEmail } from '@/lib/authz';
import Link from 'next/link';

export default function ModerationPage() {
  const [user, setUser] = useState<any>(null);
  const [tab, setTab] = useState<'reports' | 'gigs' | 'profiles'>('reports');
  const [reports, setReports] = useState<any[]>([]);
  const [gigs, setGigs] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  useEffect(() => {
    if (!user || !isAdminEmail(user.email)) return;
    if (tab === 'reports') {
      supabase.from('reports').select('*').order('created_at', { ascending: false }).limit(50).then(({ data }) => setReports(data ?? []));
    }
    if (tab === 'gigs') {
      supabase.from('gigs').select('*').eq('hidden', true).order('created_at', { ascending: false }).then(({ data }) => setGigs(data ?? []));
    }
    if (tab === 'profiles') {
      supabase.from('profiles').select('*').or('hidden.eq.true,blocked.eq.true').order('created_at', { ascending: false }).then(({ data }) => setProfiles(data ?? []));
    }
  }, [tab, user]);

  async function act(action: string, kind: 'gig' | 'profile', id: any) {
    await fetch('/api/admin/moderation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, kind, id }),
    });
    setTab(tab); // reload
  }

  if (!user) return <Shell><p>Loading…</p></Shell>;
  if (!isAdminEmail(user.email)) return <Shell><p>Not found</p></Shell>;

  return (
    <Shell>
      <h1 className="text-2xl font-bold mb-4">Admin Moderation</h1>
      <div className="flex gap-4 mb-4 text-sm">
        <button onClick={() => setTab('reports')} className={tab === 'reports' ? 'font-semibold' : ''}>Reports</button>
        <button onClick={() => setTab('gigs')} className={tab === 'gigs' ? 'font-semibold' : ''}>Gigs</button>
        <button onClick={() => setTab('profiles')} className={tab === 'profiles' ? 'font-semibold' : ''}>Profiles</button>
      </div>
      {tab === 'reports' && (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-slate-800"><th className="py-2">Kind</th><th>Target</th><th>Reporter</th><th>Reason</th><th>Time</th></tr>
          </thead>
          <tbody>
            {reports.map(r => (
              <tr key={r.id} className="border-b border-slate-800">
                <td className="py-2">{r.kind}</td>
                <td className="py-2">
                  {r.kind === 'gig' && <Link className="underline" href={`/gigs/${r.target_id}`}>{r.target_id}</Link>}
                  {r.kind === 'profile' && <span>{r.target_id}</span>}
                  {r.kind === 'message' && <span>{r.target_id}</span>}
                </td>
                <td className="py-2">{r.reporter ?? ''}</td>
                <td className="py-2">{r.reason ?? ''}</td>
                <td className="py-2">{new Date(r.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {tab === 'gigs' && (
        <ul className="space-y-2">
          {gigs.map(g => (
            <li key={g.id} className="border border-slate-800 p-2 rounded">
              <div className="flex justify-between"><span>{g.title} (#{g.id})</span><button onClick={() => act('unhide','gig',g.id)} className="underline text-sm">Unhide</button></div>
            </li>
          ))}
        </ul>
      )}
      {tab === 'profiles' && (
        <ul className="space-y-2">
          {profiles.map(p => (
            <li key={p.id} className="border border-slate-800 p-2 rounded">
              <div className="flex justify-between text-sm">
                <span>{p.full_name ?? p.id}</span>
                <div className="space-x-2">
                  {p.hidden && <button onClick={() => act('unhide','profile',p.id)} className="underline">Unhide</button>}
                  {p.blocked && <button onClick={() => act('unban','profile',p.id)} className="underline">Unban</button>}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Shell>
  );
}
