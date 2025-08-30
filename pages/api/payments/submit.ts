import type { NextApiRequest, NextApiResponse } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import type { Database, Insert } from "@/types/db";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") return res.status(405).end();
  const supabase = createServerSupabaseClient<Database>({ req, res });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return res.status(401).end();
  const { file_path } = req.body || {};
  if (!file_path || typeof file_path !== "string")
    return res.status(400).json({ error: "file_path required" });
  if (!file_path.startsWith(`${user.id}/`))
    return res.status(400).json({ error: "path must be under your uid/" });
  const { error } = await supabase
    .from("payment_proofs")
    .insert([
      { user_id: user.id, file_path } satisfies Insert<"payment_proofs">,
    ]);
  if (error && !/duplicate key/.test(error.message))
    return res.status(400).json({ error: error.message });
  return res.status(200).json({ ok: true });
}
