import type { NextApiRequest, NextApiResponse } from "next";
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { asString } from "@/lib/normalize";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.status(405).end();
    return;
  }
  const supabase = createPagesServerClient({ req, res }, {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  });
  let uid: string | null = null;
  if (
    process.env.QA_TEST_MODE === "true" &&
    typeof req.headers["x-test-user"] === "string"
  ) {
    uid = req.headers["x-test-user"] as string;
  } else {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    uid = user?.id || null;
  }
  if (!uid) {
    res.status(401).json({ error: "unauthorized" });
    return;
  }
  const id = asString(req.query.id);
  if (!id) return res.status(400).json({ error: "id required" });
  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", id)
    .eq("user_id", uid);
  if (error) {
    res.status(400).json({ error: error.message });
    return;
  }
  res.json({ ok: true });
}
