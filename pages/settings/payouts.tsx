import Shell from "@/components/Shell";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Payouts() {
  const [status, setStatus] = useState<"unknown"|"ready"|"action">("unknown");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      const uid = data.user?.id;
      if (!uid) return;
      const { data: p } = await supabase.from("profiles").select("stripe_payout_ready, stripe_account_id").eq("id", uid).single();
      setStatus(p?.stripe_payout_ready ? "ready" : "action");
    });
  }, []);

  async function connect() {
    setLoading(true);
    await fetch("/api/stripe/create-account", { method: "POST" }).then(()=>{});
    const r = await fetch("/api/stripe/account-link", { method: "POST" });
    const { url } = await r.json();
    window.location.href = url;
  }

  return (
    <Shell>
      <h1 className="text-2xl font-bold mb-4">Payouts</h1>
      <p className="mb-4">Status: {status === "ready" ? "✅ Payout ready" : "⚠️ Action needed"}</p>
      <button disabled={loading} onClick={connect} className="rounded bg-yellow-400 text-black px-4 py-2">
        {status === "ready" ? "Update Payout Details" : "Connect Payouts"}
      </button>
      <p className="mt-3 text-sm opacity-80">You’ll be taken to Stripe to finish onboarding.</p>
    </Shell>
  );
}
