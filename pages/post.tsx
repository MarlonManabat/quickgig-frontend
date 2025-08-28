import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { createJob } from "@/lib/jobs";
import { requireTicket } from "@/lib/tickets";
import { useRequireUser } from "@/lib/useRequireUser";
import type { LocationValue } from "@/components/location/LocationSelect";
const LocationSelect = dynamic(
  () => import("@/components/location/LocationSelect"),
  { ssr: false }
);
import { staticPhData } from "@/lib/ph-data";

export default function PostJobPage() {
  const { ready, userId, timedOut } = useRequireUser();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [isOnline, setIsOnline] = useState(false);
  const [location, setLocation] = useState<LocationValue>({
    regionCode: null,
    provinceCode: null,
    cityCode: null,
  });
  const [address, setAddress] = useState("");
  const [busy, setBusy] = useState(false);

  const regionName =
    staticPhData.regions.find((r) => r.region_code === location.regionCode)?.region_name || "";
  const provinceName =
    staticPhData.provinces.find((p) => p.province_code === location.provinceCode)?.province_name || "";
  const cityName =
    staticPhData.cities.find((c) => c.city_code === location.cityCode)?.city_name || "";

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
      router.push("/find");
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

        <LocationSelect value={location} onChange={setLocation} disabled={isOnline} />

        <input
          className="border rounded p-2"
          placeholder="Address (optional)"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          disabled={isOnline}
        />

        <button
          className="qg-btn qg-btn--primary px-4 py-2"
          disabled={busy}
        >
          {busy ? "Posting..." : "Post Job"}
        </button>
      </form>
    </main>
  );
}
