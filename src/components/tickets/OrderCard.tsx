'use client';

import { useState, ChangeEvent } from 'react';

export type Order = {
  id: string;
  qty: number;
  amount_php: number;
  status: string;
  receipt_url?: string | null;
};

export default function OrderCard({ order }: { order: Order }) {
  const [file, setFile] = useState<File | null>(null);

  const onFile = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    setFile(f ?? null);
  };

  return (
    <div className="border rounded p-4 space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">Order {order.id}</p>
          <p className="text-sm text-gray-500">{order.qty} tickets for ₱{order.amount_php}</p>
        </div>
        <span id="order-status" className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-800">
          {order.status}
        </span>
      </div>
      <div className="space-y-1">
        <input id="upload-receipt" type="file" onChange={onFile} />
        {file && <p className="text-sm">Selected: {file.name}</p>}
        <button id="submit-receipt" disabled className="px-3 py-1 text-sm rounded bg-gray-200">
          Upload
        </button>
      </div>
    </div>
  );
}
