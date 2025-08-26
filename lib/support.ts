import { supabase } from "@/lib/supabaseClient";

export async function submitSupportTicket(
  subject: string,
  body: string,
  email?: string,
) {
  const { data: u } = await supabase.auth.getUser();
  if (!u?.user) throw new Error("Not authenticated");
  const { error } = await supabase.from("support_tickets").insert({
    user_id: u.user.id,
    subject,
    body,
    email: email ?? null,
  });
  if (error) throw error;
}

export async function requestAccountDeletion() {
  const { error } = await supabase.rpc("request_account_deletion");
  if (error) throw error;
}

export async function purgeMyContent(days: number) {
  // For admins or maintenance only; not linked in UI for normal users
  const { data: u } = await supabase.auth.getUser();
  if (!u?.user) throw new Error("Not authenticated");
  const { error } = await supabase.rpc("purge_user_content", {
    p_user: u.user.id,
    p_days: days,
  });
  if (error) throw error;
}
