import type { NextApiRequest, NextApiResponse } from "next";
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { asString } from "@/lib/normalize";
import type { Database, Update } from '@/types/db';

function validProof(urlStr: string) {
  try {
    const url = new URL(urlStr);
    if (url.protocol !== "https:") return false;
    const allowed = [
      new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://app.quickgig.ph")
        .host,
      new URL(process.env.NEXT_PUBLIC_SUPABASE_URL || "https://app.quickgig.ph")
        .host,
    ];
    return allowed.some((h) => url.host.endsWith(h));
  } catch {
    return false;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "method not allowed" });
    return;
  }
  const supabase = createPagesServerClient<Database>({ req, res }, {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  });
  await supabase.rpc("set_config", {
    setting_name: "app.admin_emails",
    new_value: process.env.ADMIN_EMAILS ?? "",
    is_local: true,
  });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    res.status(401).json({ error: "unauthorized" });
    return;
  }

  const { proof_url } = req.body || {};
  if (!proof_url || !validProof(proof_url)) {
    res.status(400).json({ error: "invalid proof_url" });
    return;
  }

  const id = asString(req.query.id);
  if (!id) return res.status(400).json({ error: "id required" });
  const { error } = await supabase
    .from("orders")
    .update({ proof_url, status: "submitted" } as Update<'orders'>)
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) {
    res.status(400).json({ error: error.message });
    return;
  }
  res.json({ ok: true });
}
