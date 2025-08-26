import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

export async function requireAdmin(ctx: any) {
  const supabase = createServerSupabaseClient(ctx);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { redirect: { destination: "/login", permanent: false } };

  const allowed = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  if (!allowed.includes((user.email || "").toLowerCase())) {
    return { notFound: true };
  }

  return { props: {} };
}
