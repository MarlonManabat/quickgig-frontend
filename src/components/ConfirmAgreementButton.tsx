"use client";
import { useState } from "react";
import useSWR from "swr";

export function ConfirmAgreementButton({ agreementId }: { agreementId: string }) {
  const { data, mutate } = useSWR<{ balance?: number }>(
    "/api/tickets/balance",
    u => fetch(u).then(r => r.json()),
  );
  const bal = data?.balance ?? 0;
  const [loading, setLoading] = useState(false);

  async function onConfirm() {
    setLoading(true);
    try {
      const res = await fetch(`/api/agreements/${agreementId}/confirm`, {
        method: "POST",
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed");
      mutate({ balance: json.balance }, false);
    } catch (e: any) {
      alert(
        e.message === "INSUFFICIENT_TICKETS"
          ? "You need at least 1 ticket."
          : e.message,
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        className="rounded-md px-4 py-2 border disabled:opacity-50"
        onClick={onConfirm}
        disabled={loading || bal <= 0}
        title={bal <= 0 ? "No tickets remaining" : ""}
      >
        {loading ? "Confirming..." : "Confirm agreement"}
      </button>
      <span className="text-sm text-slate-600">Balance: {bal}</span>
    </div>
  );
}
