"use client";
import { useState } from "react";
import useSWR from "swr";
import TicketBadge from "@/components/TicketBadge";

const fetcher = (u: string) => fetch(u).then(r => r.json());

export default function AdminTicketsClient() {
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState(1);
  const [note, setNote] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  const { data: myBal } = useSWR<{ balance?: number }>("/api/tickets/balance", fetcher);

  async function grant() {
    setMsg(null);
    const res = await fetch("/api/tickets/grant", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, amount: Number(amount), note }),
    });
    const json = await res.json();
    if (!res.ok) {
      setMsg(json?.detail || json?.error || "Failed");
      return;
    }
    setMsg(`Granted ${json.amount} tickets to ${json.email}. New balance (reported): ${json.balance ?? "n/a"}`);
  }

  return (
    <div className="max-w-xl space-y-4">
      <h1 className="text-2xl font-semibold">Admin · Tickets</h1>
      <div className="flex items-center gap-2">
        <TicketBadge />
        <p className="text-sm text-gray-500">Your balance: {myBal?.balance ?? "…"}</p>
      </div>

      <div className="space-y-2">
        <label className="block text-sm">User email</label>
        <input
          className="w-full border rounded p-2"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="user@example.com"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm">Amount</label>
        <input
          className="w-full border rounded p-2"
          type="number"
          min={1}
          value={amount}
          onChange={e => setAmount(Number(e.target.value))}
        />
      </div>

      <div className="space-y-2">
      <label className="block text-sm">Note (optional)</label>
      <input
        className="w-full border rounded p-2"
        value={note}
        onChange={e => setNote(e.target.value)}
        placeholder="promo / goodwill / fix"
      />
      </div>

      <button className="px-4 py-2 rounded bg-black text-white" onClick={grant}>
        Grant tickets
      </button>

      {msg && <p className="text-sm">{msg}</p>}
      <p className="text-xs text-gray-400">Only members listed in ADMIN_EMAILS can access this route.</p>
    </div>
  );
}
