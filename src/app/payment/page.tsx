import fs from 'fs';
import path from 'path';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

function getQrSrc() {
  const base = path.join(process.cwd(), 'public');
  const png = path.join(base, 'gcash-qr.png');
  if (fs.existsSync(png)) return '/gcash-qr.png';
  const jpg = path.join(base, 'gcash-qr.jpg');
  if (fs.existsSync(jpg)) return '/gcash-qr.jpg';
  return '/gcash-qr.svg';
}

export default function PaymentPage() {
  const qrSrc = getQrSrc();
  return (
    <main className="p-4 flex flex-col items-center space-y-4">
      <h1 className="text-2xl font-bold">Payment</h1>
      <Image src={qrSrc} alt="GCash QR" width={300} height={300} className="w-full max-w-xs h-auto" />
      <p className="text-center">Scan QR in GCash, then send proof via Support.</p>
      <a
        href="mailto:support@quickgig.ph?subject=GCash%20Payment%20Proof"
        className="bg-yellow-400 px-4 py-2 rounded"
      >
        Email Support
      </a>
    </main>
  );
}
