"use client";

import { useEffect, useState } from "react";
import LinkApp from "@/components/LinkApp";
import { ROUTES } from "@/lib/routes";

export default function TicketBalanceChip() {
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/tickets/balance")
      .then((r) => r.json())
      .then((j) => {
        if (alive) setBalance(typeof j?.balance === "number" ? j.balance : 0);
      })
      .catch(() => {
        if (alive) setBalance(null);
      });
    return () => {
      alive = false;
    };
  }, []);

  if (balance === null) return null;
  return (
    <LinkApp
      href={ROUTES.tickets}
      className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-sm bg-gray-100 hover:bg-gray-200"
    >
      <span>Tickets</span>
      <span className="font-semibold">{balance}</span>
    </LinkApp>
  );
}
