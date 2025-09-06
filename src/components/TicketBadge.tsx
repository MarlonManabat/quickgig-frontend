"use client";
import useSWR from "swr";

const fetcher = (u: string) => fetch(u).then(r => r.json());

export default function TicketBadge() {
  const { data } = useSWR<{ balance?: number }>("/api/tickets/balance", fetcher, { refreshInterval: 30000 });
  const balance = data?.balance ?? "—";
  return (
    <span className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-sm">
      <span className="font-medium">Tickets</span>
      <span className="rounded-full bg-neutral-800 text-white px-2 py-[1px]">{balance}</span>
    </span>
  );
}
