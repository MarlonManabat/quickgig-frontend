import type { NextApiRequest, NextApiResponse } from "next";
import { env, requireServer } from "@/lib/env";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const enabled = process.env.QA_TEST_MODE === "true";
  const okHeader = req.headers["x-qa-secret"] === process.env.QA_TEST_SECRET;
  if (!enabled) return res.status(404).end();
  if (!okHeader) return res.status(401).json({ error: "unauthorized" });
  if (req.method !== "POST") return res.status(405).end();
  const { email } = req.body || {};
  if (!email) return res.status(400).json({ error: "email required" });
  const key = requireServer('SUPABASE_SERVICE_ROLE_KEY');
  if (!key) return res.status(500).end();
  const supabase = createClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    key,
    { auth: { persistSession: false } },
  );
  await supabase.auth.admin
    .createUser({ email, email_confirm: true })
    .catch(() => {});
  const { data, error } = await supabase.auth.admin.generateLink({
    type: "magiclink",
    email,
  });
  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json({ link: data.properties.action_link });
}
