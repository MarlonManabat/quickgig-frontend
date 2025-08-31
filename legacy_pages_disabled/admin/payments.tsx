import { GetServerSideProps } from "next";
import dynamic from "next/dynamic";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import type { PendingPayment } from "@/components/AdminPayments";

const AdminPayments = dynamic(() => import("@/components/AdminPayments"), {
  ssr: false,
  loading: () => <div className="h-16" />,
});

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const guard = await requireAdmin(ctx);
  // @ts-ignore
  if (guard.redirect) return guard;
  const supabase = createServerSupabaseClient(ctx);
  const { data } = await supabase
    .from("payments")
    .select("id,user_id,amount_php,expected_tickets,gcash_reference,created_at")
    .eq("status", "pending")
    .order("created_at", { ascending: true });
  return { props: { initial: data || [] } };
};

export default function AdminPaymentsPage(props: {
  initial: PendingPayment[];
}) {
  return <AdminPayments {...props} />;
}
