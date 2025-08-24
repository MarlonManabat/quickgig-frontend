import { supabase } from "@/lib/supabaseClient";

export async function listUsers({ q = "", limit = 50, offset = 0 } = {}) {
  // expects profiles has: id, email, role, suspended_at, created_at
  let query = supabase
    .from("profiles")
    .select("id, email, role, suspended_at, created_at, delete_requested_at, deleted_at")
    .order("created_at", { ascending: false });
  if (q) query = query.ilike("email", `%${q}%`);
  return query.range(offset, offset + limit - 1);
}

export async function listJobs({ q = "", status = "", limit = 50, offset = 0 } = {}) {
  // assumes jobs has: id, title, status, user_id, created_at
  let query = supabase
    .from("jobs")
    .select("id, title, status, user_id, created_at")
    .order("created_at", { ascending: false });
  if (q) query = query.ilike("title", `%${q}%`);
  if (status) query = query.eq("status", status);
  return query.range(offset, offset + limit - 1);
}

export async function listPayments({ status = "pending", limit = 50, offset = 0 } = {}) {
  return supabase
    .from("payments")
    .select(
      "id, user_id, amount_php, expected_tickets, gcash_reference, status, created_at"
    )
    .eq("status", status)
    .order("created_at", { ascending: true })
    .range(offset, offset + limit - 1);
}

export async function listReviews({ hidden }: { hidden?: boolean } = {}) {
  let q = supabase
    .from("reviews")
    .select(
      "id, job_id, reviewer_id, reviewee_id, rating, comment, hidden, created_at"
    )
    .order("created_at", { ascending: false });
  if (hidden !== undefined) q = q.eq("hidden", hidden);
  return q;
}

export async function setFlag(key: string, enabled: boolean) {
  return supabase.rpc("admin_set_flag", { p_key: key, p_enabled: enabled });
}
export async function hideReview(id: string, reason: string) {
  return supabase.rpc("admin_hide_review", { p_review: id, p_reason: reason });
}
export async function unhideReview(id: string) {
  return supabase.rpc("admin_unhide_review", { p_review: id });
}
export async function suspendUser(id: string) {
  return supabase.rpc("admin_suspend_user", { p_user: id });
}
export async function unsuspendUser(id: string) {
  return supabase.rpc("admin_unsuspend_user", { p_user: id });
}

export async function purgeUserContent(id: string, days: number) {
  return supabase.rpc("purge_user_content", { p_user: id, p_days: days });
}
