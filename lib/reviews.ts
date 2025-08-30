import { supabase } from "@/utils/supabaseClient";
import type { Insert } from "@/types/db";

export async function createReview(
  appId: number,
  reviewee: string,
  rating: number,
  comment?: string,
) {
  return supabase
    .from("reviews")
    .insert([
      { app_id: appId, reviewee, rating, comment } satisfies Insert<"reviews">,
    ]);
}

export async function listReviewsForUser(userId: string, limit = 10) {
  return supabase
    .from("reviews")
    .select("id, rating, comment, created_at, reviewer, app_id")
    .eq("reviewee", userId)
    .order("created_at", { ascending: false })
    .limit(limit);
}
