import type { NextApiRequest, NextApiResponse } from "next";
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "method not allowed" });
    return;
  }
  const supabase = createPagesServerClient({ req, res }, {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    res.status(401).json({ error: "unauthorized" });
    return;
  }
  const id = req.query.id;
  const { cover_letter } = req.body || {};
  const { error } = await supabase.from("applications").insert({
    applicant_id: user.id,
    gig_id: id,
    message: cover_letter ?? null,
  });
  if (error) {
    if ((error as any).code === "23505") {
      res.status(409).json({ error: "already applied" });
      return;
    }
    res.status(400).json({ error: error.message });
    return;
  }
  res.json({ ok: true });
}
