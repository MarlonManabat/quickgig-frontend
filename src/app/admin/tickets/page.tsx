import { getServerSupabase } from "@/lib/supabase-server";
import { isAdmin } from "@/lib/admin";
import { notFound } from "next/navigation";
import Client from "./Client";

export default async function AdminTicketsPage() {
  const supa = getServerSupabase();
  const {
    data: { user },
  } = await supa.auth.getUser();
  if (!user || !isAdmin(user.email)) {
    notFound();
  }
  return <Client />;
}
