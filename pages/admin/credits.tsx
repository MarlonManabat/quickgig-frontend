import { useState } from 'react';
import { createClient } from '@/lib/supabase';
import { withAdminGuard } from '@/components/guards/withAdminGuard';

function AdminCredits() {
  const supabase = createClient();
  const [query, setQuery] = useState('');
  const [userId, setUserId] = useState('');
  const [credits, setCredits] = useState<number | null>(null);

  async function lookup() {
    let id = query;
    if (query.includes('@')) {
      const { data } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', query)
        .single();
      id = data?.id || '';
    }
    setUserId(id);
    if (id) {
      const { data } = await supabase
        .from('user_credits')
        .select('credits')
        .eq('user_id', id)
        .maybeSingle();
      setCredits(data?.credits ?? 0);
    }
  }

  async function grant(delta: number) {
    if (!userId) return;
    const { data, error } = await supabase.rpc('grant_credits', {
      p_user: userId,
      p_delta: delta,
    });
    if (!error) setCredits(data as number);
  }

  return (
    <main className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Grant Credits</h1>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="user id or email"
        className="input w-full"
      />
      <button className="qg-btn qg-btn--primary" onClick={lookup}>
        Lookup
      </button>
      {credits !== null && (
        <>
          <p>Credits: {credits}</p>
          <div className="flex gap-2">
            {[1, 3, 10].map((n) => (
              <button
                key={n}
                className="qg-btn qg-btn--secondary"
                onClick={() => grant(n)}
              >
                +{n}
              </button>
            ))}
          </div>
        </>
      )}
    </main>
  );
}

export default withAdminGuard(AdminCredits);
