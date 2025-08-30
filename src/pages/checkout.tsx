import { useState } from "react";
import Shell from "@/components/Shell";
import Image from "next/image";
import {
  TICKET_PRICE_PHP,
  FREE_TICKETS_ON_SIGNUP,
  GCASH_PAYEE_NAME,
  GCASH_NUMBER,
  GCASH_QR_URL,
  GCASH_NOTES,
} from "@/lib/payments";

export default function CheckoutPage() {
  const [order, setOrder] = useState<{ id: number; reference: string } | null>(
    null,
  );
  const [proofUrl, setProofUrl] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  async function createOrder() {
    const res = await fetch("/api/orders", { method: "POST" });
    const data = await res.json();
    if (res.ok) setOrder(data);
    else setMsg(data.error);
  }

  async function submitProof(e: React.FormEvent) {
    e.preventDefault();
    if (!order) return;
    const res = await fetch(`/api/orders/${order.id}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ proof_url: proofUrl }),
    });
    const data = await res.json();
    if (res.ok) setMsg("Submitted!");
    else setMsg(data.error);
  }

  return (
    <Shell>
      <h1 className="text-2xl font-bold mb-4">Buy Ticket</h1>
      <p className="mb-4">
        Each ticket costs ₱{TICKET_PRICE_PHP}. You received{" "}
        {FREE_TICKETS_ON_SIGNUP} free tickets when you signed up.
      </p>
      <p className="mb-4">
        Send your payment via GCash to <strong>{GCASH_PAYEE_NAME}</strong> (
        <span className="font-mono">{GCASH_NUMBER}</span>).
        {GCASH_NOTES && <span> {GCASH_NOTES}</span>}
      </p>
      <Image
        src={GCASH_QR_URL}
        alt="GCash QR"
        width={200}
        height={200}
        placeholder="blur"
        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mO8dOnSfwAIhwNqCMJy1AAAAABJRU5ErkJggg=="
        className="max-w-xs mb-4"
      />
      {!order ? (
        <button onClick={createOrder} className="btn-primary">
          Create Order
        </button>
      ) : (
        <form onSubmit={submitProof} className="space-y-3 max-w-md">
          <p>
            Reference: <span className="font-mono">{order.reference}</span>
          </p>
          <input
            className="input"
            placeholder="Proof image URL"
            value={proofUrl}
            onChange={(e) => setProofUrl(e.target.value)}
          />
          <button className="btn-primary">Submit</button>
        </form>
      )}
      {msg && <p className="mt-3">{msg}</p>}
    </Shell>
  );
}
