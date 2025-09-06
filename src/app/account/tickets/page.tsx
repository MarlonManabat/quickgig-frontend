import TicketBadge from "@/components/TicketBadge";

export default function TicketsPage() {
  return (
    <main className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Your Tickets</h1>
      <TicketBadge />
      <p className="text-sm text-neutral-500">
        You receive 3 free tickets on signup. One ticket is spent when an agreement is reached.
      </p>
    </main>
  );
}
