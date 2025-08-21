import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Health check: verifies required env vars exist and Supabase Auth health responds 200.
 * Returns: { ok: boolean, supabase?: { ok: boolean, status: number }, missing?: string[] }
 */
export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const missing: string[] = [];
  if (!process.env.NEXT_PUBLIC_SITE_URL) missing.push("NEXT_PUBLIC_SITE_URL");
  if (!url) missing.push("NEXT_PUBLIC_SUPABASE_URL");
  if (!anon) missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  if (missing.length) {
    return res.status(500).json({ ok: false, missing });
  }

  try {
    // Supabase Auth health endpoint
    const r = await fetch(`${url}/auth/v1/health`, { headers: { apikey: anon! } });
    return res.status(200).json({ ok: r.ok, supabase: { ok: r.ok, status: r.status } });
  } catch (e: any) {
    return res.status(200).json({ ok: false, supabase: { ok: false, status: 0 }, error: String(e?.message ?? e) });
  }
}

