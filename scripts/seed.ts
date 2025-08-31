import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/db";
import { env, requireServer } from "@/lib/env";

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = requireServer('SUPABASE_SERVICE_ROLE')!;
const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "demo-admin@quickgig.test";
const userEmail = "demo-user@quickgig.test";
const newUserEmail = "new-user@quickgig.test";

async function run() {
  const supabase = createClient<Database>(url, serviceKey, {
    auth: { persistSession: false },
  });

  // Ensure storage buckets
  for (const b of ["avatars", "payment-proofs"]) {
    const { data } = await supabase.storage.listBuckets();
    if (!data?.find((x) => x.name === b)) {
      await supabase.storage.createBucket(b, { public: true });
    }
  }

  const profiles = [
    {
      id: "00000000-0000-0000-0000-000000000001",
      email: userEmail,
      full_name: "Demo User",
      role: "user",
      is_admin: false,
      can_post: false,
    },
    {
      id: "00000000-0000-0000-0000-000000000002",
      email: newUserEmail,
      full_name: "New User",
      role: "user",
      is_admin: false,
      can_post: false,
    },
    {
      id: "00000000-0000-0000-0000-000000000003",
      email: adminEmail,
      full_name: "Demo Admin",
      role: "admin",
      is_admin: true,
      can_post: true,
    },
  ];

  for (const p of profiles) {
    await supabase.from("profiles").upsert(p, { onConflict: "id" });
  }

  console.log("Seed completed");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
