import type { NextApiRequest, NextApiResponse } from 'next';
import { createServerClient } from '@supabase/auth-helpers-nextjs';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') return res.status(405).end();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (k) => (req.cookies as any)[k] } }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return res.status(401).send('auth required');

  const { title, desc } = (req.body || {}) as {
    title?: string;
    desc?: string;
  };
  if (!title) return res.status(400).send('title required');

  const { error: insertErr } = await supabase.from('jobs').insert({
    user_id: user.id,
    title,
    description: desc,
  });
  if (insertErr) return res.status(400).send(insertErr.message);

  const { error: decErr } = await supabase.rpc('decrement_credit');
  if (decErr) {
    return res
      .status(409)
      .send(`posted but credit update failed: ${decErr.message}`);
  }

  return res.status(200).json({ ok: true });
}

