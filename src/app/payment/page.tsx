export default function PaymentPage() {
  return (
    <main className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Payment</h1>
      <p>Upload proof of payment via support while gateway is being integrated.</p>
      {/* eslint-disable-next-line @next/next/no-img-element -- placeholder */}
      <img src="/gcash-qr.png" alt="GCash QR" className="max-w-xs" />
    </main>
  );
}
