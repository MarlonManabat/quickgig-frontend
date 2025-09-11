"use client";

export default function Page() {
  return (
    <main>
      <h1>Post Job</h1>
      <input placeholder="Job title" />
      <textarea placeholder="Describe the work"></textarea>
      <select data-testid="select-region"><option>Region A</option><option>Region B</option></select>
      <select data-testid="select-city"><option>City A</option><option>City B</option></select>

      <div>
        <button id="buy-1" onClick={() => {
          const el = document.getElementById('order-status');
          if (el) el.textContent = 'pending';
        }}>Buy</button>
        <div id="order-status">pending</div>
      </div>
    </main>
  );
}
