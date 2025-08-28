import type { NextApiRequest, NextApiResponse } from "next";
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const supabase = createPagesServerClient({ req, res }, {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  });

  if (req.method === "GET") {
    const { q, city } = req.query as { q?: string; city?: string };
    let query = supabase
      .from("gigs")
      .select("*")
      .neq("hidden", true)
      .order("created_at", { ascending: false });
    if (q) query = query.ilike("title", `%${q}%`);
    if (city) query = query.ilike("city", `%${city}%`);
    const { data, error } = await query;
    if (error) return res.status(400).json({ error: error.message });
    return res.json({ gigs: data });
  }

  if (req.method === "POST") {
    const token = req.headers.authorization?.replace("Bearer ", "");
    const {
      data: { user },
    } = await supabase.auth.getUser(token);
    if (!user) return res.status(401).json({ error: "unauthorized" });
    const { title, description, city, budget } = req.body;
    if (!title || !description || !city || budget === undefined) {
      return res.status(400).json({ error: "missing fields" });
    }
    const { data, error } = await supabase
      .from("gigs")
      .insert({
        title,
        description,
        city,
        budget,
        created_by: user.id,
      })
      .select()
      .single();
    if (error) return res.status(400).json({ error: error.message });
    return res.json({ gig: data });
  }

  return res.status(405).json({ error: "method not allowed" });
}
