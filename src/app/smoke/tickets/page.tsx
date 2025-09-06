"use client";

export default function Page() {
  return (
    <main>
      <h1>Tickets</h1>
      <button
        data-testid="buy-tickets"
        data-cta="buy-tickets"
        onClick={() => {
          const el = document.getElementById('order-status');
          if (el) el.textContent = 'pending';
        }}
      >
        Buy Tickets
      </button>
      <div id="order-status">pending</div>
    </main>
  );
}
