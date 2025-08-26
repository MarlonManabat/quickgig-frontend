"use client";
import { useEffect, useState } from "react";
import AdminTable from "@/components/AdminTable";
import { listReviews, hideReview, unhideReview } from "@/lib/admin";

export default function AdminReviews() {
  const [rows, setRows] = useState<any[]>([]);
  const [hidden, setHidden] = useState<boolean | undefined>(undefined);

  const load = async () => {
    const { data } = await listReviews({ hidden });
    setRows(data || []);
  };

  useEffect(() => {
    load();
  }, [hidden]);

  const handleHide = async (id: string) => {
    const reason = prompt("Reason for hiding?") || "N/A";
    await hideReview(id, reason);
    await load();
  };

  const handleUnhide = async (id: string) => {
    if (confirm("Unhide review?")) {
      await unhideReview(id);
      await load();
    }
  };

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Reviews</h1>
      <div className="mb-4">
        <select
          value={hidden === undefined ? "" : hidden ? "hidden" : "visible"}
          onChange={(e) => {
            const v = e.target.value;
            setHidden(v === "" ? undefined : v === "hidden");
          }}
          className="border p-2"
        >
          <option value="">All</option>
          <option value="visible">Visible</option>
          <option value="hidden">Hidden</option>
        </select>
      </div>
      <AdminTable>
        <thead>
          <tr className="text-left">
            <th>Rating</th>
            <th>Comment</th>
            <th>Hidden</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-t">
              <td>{r.rating}</td>
              <td className="max-w-xs truncate">{r.comment}</td>
              <td>{r.hidden ? "yes" : "no"}</td>
              <td>
                {r.hidden ? (
                  <button
                    onClick={() => handleUnhide(r.id)}
                    data-testid="admin-unhide-review"
                    className="underline text-sm"
                  >
                    Unhide
                  </button>
                ) : (
                  <button
                    onClick={() => handleHide(r.id)}
                    data-testid="admin-hide-review"
                    className="underline text-sm"
                  >
                    Hide
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </AdminTable>
    </main>
  );
}
