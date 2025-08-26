#!/usr/bin/env tsx
import { createClient } from "@supabase/supabase-js";

const {
  NODE_ENV,
  VERCEL,
  QA_TEST_MODE,
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  SEED_ADMIN_EMAIL,
} = process.env;

if (!((NODE_ENV === "production" && VERCEL === "1") || QA_TEST_MODE === "1")) {
  console.log("[seed-preview] skipped: not in preview environment");
  process.exit(0);
}

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("[seed-preview] missing Supabase env");
  process.exit(1);
}

const adminEmail = SEED_ADMIN_EMAIL || "demo-admin@quickgig.test";

async function run() {
  const supabase = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
    auth: { persistSession: false },
  });

  const profiles = [
    {
      id: "00000000-0000-0000-0000-000000000001",
      email: adminEmail,
      full_name: "QA Admin",
      role: "admin",
      is_admin: true,
      can_post: true,
    },
  ];

  for (const p of profiles) {
    await supabase.from("profiles").upsert(p, { onConflict: "id" });
  }

  console.log("[seed-preview] seeded deterministic data");
}

run().catch((e) => {
  console.error("[seed-preview] failed", e);
  process.exit(1);
});
