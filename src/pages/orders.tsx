import { useEffect, useState } from "react";
import Shell from "@/components/Shell";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((d) => setOrders(d.orders || []));
  }, []);
  return (
    <Shell>
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>
      <ul className="space-y-2">
        {orders.map((o, i) => (
          <li
            key={o.id}
            className={`border p-2 rounded ${i === 0 ? "border-yellow-400" : "border-slate-700"}`}
          >
            <div>Ref: {o.reference}</div>
            <div>Status: {o.status}</div>
            {o.proof_url && (
              <a href={o.proof_url} className="text-sm underline">
                Proof
              </a>
            )}
          </li>
        ))}
      </ul>
    </Shell>
  );
}
