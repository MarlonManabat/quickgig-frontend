"use client";
import { useState } from "react";
import Header from "../_components/Header";

export default function Page() {
  const [status, setStatus] = useState("");
  return (
    <main className="p-6 space-y-4">
      <Header />
      <a
        id="buy-5"
        data-testid="buy-tickets"
        data-cta="buy-tickets"
        href="/tickets/topup"
        onClick={(e) => {
          e.preventDefault();
          setStatus('pending');
        }}
      >
        Buy 5
      </a>
      <div id="order-status">{status}</div>
    </main>
  );
}
