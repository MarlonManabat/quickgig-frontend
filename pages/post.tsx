import { useState } from "react";
import { createJob } from "@/lib/jobs";
import { requireTicket } from "@/lib/tickets";
import { useRequireUser } from "@/lib/useRequireUser";
import GeoSelect, { GeoValue } from "@/components/location/GeoSelect";

export default function PostJobPage() {
  const { ready, userId, timedOut } = useRequireUser();
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [isOnline, setIsOnline] = useState(false);
  const [location, setLocation] = useState<GeoValue>({
    region: null,
    province: null,
    city: null,
  });
  const [locationLoading, setLocationLoading] = useState(false);
  const [address, setAddress] = useState("");
  const [busy, setBusy] = useState(false);

  const regionName = location.region?.name || "";
  const provinceName = location.province?.name || "";
  const cityName = location.city?.name || "";

  async function onSubmit(e: any) {
    e.preventDefault();
    if (!userId) return;
    setBusy(true);
    try {
      await requireTicket(userId, "post_job");
      await createJob({
        title: title.trim(),
        company: company.trim() || undefined,
        is_online: isOnline,
        region: isOnline ? null : regionName || null,
        province: isOnline ? null : provinceName || null,
        city: isOnline ? null : cityName || null,
        address: isOnline ? null : address.trim() || null,
      });
      window.location.href = "/find";
    } catch (err: any) {
      if (err.message?.includes("Insufficient tickets")) {
        alert(
          "Kulang ang tickets para mag-post. Tap the bell to contact Support.",
        );
      } else {
        console.error(err);
        alert("Could not post job");
      }
    } finally {
      setBusy(false);
    }
  }

  if (!ready)
    return <p className="p-6">{timedOut ? "Auth timeout" : "Loading..."}</p>;

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Post a Job</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          className="w-full border rounded p-2"
          placeholder="Job title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          className="w-full border rounded p-2"
          placeholder="Company (optional)"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isOnline}
            onChange={(e) => setIsOnline(e.target.checked)}
          />
          Online Job
          <span
            className="text-xs text-gray-500"
            title="Online Job = work-from-anywhere; hindi kailangan ng exact address."
          >
            ⓘ
          </span>
        </label>

        <GeoSelect
          value={location}
          onChange={setLocation}
          isOnline={isOnline}
          onLoadingChange={setLocationLoading}
        />

        <input
          className="border rounded p-2"
          placeholder="Address (optional)"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          disabled={isOnline}
        />

        <button
          className="qg-btn qg-btn--primary px-4 py-2"
          disabled={busy || locationLoading}
        >
          {busy ? "Posting..." : "Post Job"}
        </button>
      </form>
    </main>
  );
}
