"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import GeoSelect, { type GeoValue } from "@/components/location/GeoSelect";
import { getBrowserSupabase } from "@/lib/supabase-browser";
import { apiUrl } from "@/lib/url";
import toast from "@/utils/toast";
import PostJobSkeleton from "./PostJobSkeleton";

type Props = {
  balance?: number;
  onSubmitted?: () => void;
  submitPath?: string;
};

export default function PostJobForm({ balance = 0, onSubmitted, submitPath = "/api/gigs/create" }: Props) {
  const [geo, setGeo] = useState<GeoValue>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let active = true;
    async function checkSession() {
      const sb = getBrowserSupabase();
      if (!sb) {
        setError(new Error("Supabase client unavailable"));
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await sb.auth.getSession();
        if (error) throw error;
        if (!data.session?.user) throw new Error("No active session");
        if (!active) return;
        setLoading(false);
      } catch (err: any) {
        if (!active) return;
        setError(err);
        setLoading(false);
      }
    }
    checkSession();
    return () => {
      active = false;
    };
  }, []);

  if (loading) return <PostJobSkeleton />;
  if (error) throw error;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    if (geo.regionCode) fd.set("region_code", geo.regionCode);
    if (geo.provinceCode) fd.set("province_code", geo.provinceCode);
    if (geo.cityCode) fd.set("city_code", geo.cityCode);
    if (geo.cityName) fd.set("city_name", geo.cityName);

    let submitUrl: string;
    try {
      submitUrl = apiUrl(submitPath);
    } catch (err) {
      console.error(err);
      toast.error("Config error: API base missing");
      return;
    }

    try {
      const res = await fetch(submitUrl, { method: "POST", body: fd });
      if (res.status === 402 || res.status === 403) {
        toast.info("You need a ticket to post. Redirecting…");
        window.location.href = "/billing/tickets?next=/gigs/create";
        return;
      }
      if (!res.ok) throw new Error("Failed to post job");
      toast.success("Job posted!");
      form.reset();
      setGeo({});
      onSubmitted?.();
    } catch (err) {
      console.error(err);
      toast.error("Could not post job. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-base">
      <div>
        <label htmlFor="title" className="block mb-1">Title</label>
        <input
          id="title"
          name="title"
          required
          className="w-full border rounded-lg p-2"
        />
      </div>
      <div>
        <label htmlFor="description" className="block mb-1">Description</label>
        <textarea
          id="description"
          name="description"
          required
          className="w-full border rounded-lg p-2"
        />
      </div>
      <div>
        <label className="block mb-1">Location</label>
        <GeoSelect value={geo} onChange={setGeo} className="mt-1" />
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1">
          <label htmlFor="budget" className="block mb-1">Budget (₱)</label>
          <input
            id="budget"
            name="budget"
            type="number"
            min="0"
            step="1"
            className="w-full border rounded-lg p-2"
          />
        </div>
        <button
          type="submit"
          className="border rounded-xl px-4 py-2 font-medium w-full sm:w-auto"
        >
          Post Job
        </button>
      </div>
      {balance === 0 && (
        <p className="text-sm">
          You need a ticket to post.{' '}
          <Link href="/billing/tickets?next=/gigs/create" className="underline">
            Buy ticket
          </Link>
          .
        </p>
      )}
    </form>
  );
}
