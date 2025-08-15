import fs from 'fs';
import path from 'path';

export default function PaymentPage() {
  const qrPath = path.join(process.cwd(), 'public', 'gcash-qr.png');
  const hasQr = fs.existsSync(qrPath);
  return (
    <main className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Payment</h1>
      {hasQr ? (
        // eslint-disable-next-line @next/next/no-img-element -- placeholder
        <img
          src="/gcash-qr.png"
          alt="GCash QR"
          className="max-w-xs w-full h-auto"
        />
      ) : (
        <div className="max-w-sm border rounded p-4 bg-white/70 space-y-4">
          <p>No QR uploaded yet. Email or upload proof of payment while the gateway is in beta.</p>
          <a
            href="mailto:support@quickgig.ph"
            className="inline-block bg-yellow-400 px-4 py-2 rounded"
          >
            Upload Proof
          </a>
        </div>
      )}
    </main>
  );
}
