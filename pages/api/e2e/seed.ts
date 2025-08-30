import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  // Optional protection: if E2E_KEY is set, require it; else, allow no-op seeding
  const requiredKey = process.env.E2E_KEY;
  if (requiredKey && req.headers["x-e2e-key"] !== requiredKey) return res.status(401).end();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string | undefined;
  const role = process.env.SUPABASE_SERVICE_ROLE as string | undefined;
  if (!url || !role) {
    // If Supabase vars are not present (e.g., preview site), just succeed no-op
    return res.status(204).end();
  }

  const supabase = createClient(url, role, { auth: { persistSession: false } });

  // Idempotent seed; values can be provided via optional E2E_* secrets, or defaults used.
  const employerEmail = process.env.E2E_EMPLOYER_EMAIL || "e2e-employer@quickgig.ph";
  const workerEmail = process.env.E2E_WORKER_EMAIL || "e2e-worker@quickgig.ph";
  const passwd = process.env.E2E_PASSWORD || "E2e!Pass123";

  try {
    await supabase.auth.admin.createUser({ email: employerEmail, password: passwd, email_confirm: true });
  } catch {}
  try {
    await supabase.auth.admin.createUser({ email: workerEmail, password: passwd, email_confirm: true });
  } catch {}

  const { data: users } = await supabase
    .from("users")
    .select("id,email")
    .in("email", [employerEmail, workerEmail]);

  const employer_id = users?.find((u) => u.email === employerEmail)?.id;
  const worker_id = users?.find((u) => u.email === workerEmail)?.id;

  // profiles table holds role + tickets in our app. Idempotent upsert.
  if (employer_id || worker_id) {
    await supabase
      .from("profiles")
      .upsert([
        employer_id ? { user_id: employer_id, role: "employer", tickets: 3 } : undefined,
        worker_id ? { user_id: worker_id, role: "worker", tickets: 3 } : undefined,
      ].filter(Boolean) as any);
  }

  return res.status(200).json({ ok: true, employer_id, worker_id });
}
