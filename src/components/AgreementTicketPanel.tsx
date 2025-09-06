"use client";

import { useEffect, useState } from "react";

type Props = {
  /** optional: pass a handler or a selector id for the existing Accept button */
  acceptButtonId?: string; // e.g., "agree-accept"
};

export default function AgreementTicketPanel({ acceptButtonId }: Props) {
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/tickets/balance")
      .then((r) => r.json())
      .then((j) => setBalance(typeof j?.balance === "number" ? j.balance : 0))
      .catch(() => setBalance(null));
  }, []);

  useEffect(() => {
    if (!acceptButtonId || balance === null) return;
    const btn = document.getElementById(acceptButtonId) as HTMLButtonElement | null;
    if (!btn) return;
    btn.disabled = balance <= 0;
    btn.title = balance <= 0 ? "You need at least 1 ticket to accept" : "";
  }, [acceptButtonId, balance]);

  return (
    <div className="rounded border p-3 bg-gray-50">
      <div className="text-sm text-gray-600">
        Ticket cost to accept: <b>1</b>
      </div>
      <div className="text-sm">
        Your balance:{" "}
        <b className={balance !== null && balance <= 0 ? "text-red-600" : "text-gray-900"}>
          {balance === null ? "…" : balance}
        </b>
      </div>
      {balance !== null && balance <= 0 && (
        <div className="mt-1 text-xs text-red-600">Not enough tickets.</div>
      )}
    </div>
  );
}
