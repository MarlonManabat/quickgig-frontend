"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ApplyButton from "@/components/ApplyButton";

type Job = {
  id: string;
  title: string;
  company?: string;
  description?: string;
  location?: string;
  region?: string;
  rate?: number;
  pay_min?: number;
  pay_max?: number;
  [key: string]: any;
};

export default function JobDetailPage({ params }: { params: { id: string } }) {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadJob() {
      try {
        const res = await fetch(`/api/gigs/${params.id}`);
        if (!res.ok) {
          setError(true);
          return;
        }
        const data = await res.json();
        setJob(data.gig || data);
      } catch (err) {
        console.error('Error loading job:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    loadJob();
  }, [params.id]);

  if (loading) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-8">
        <div className="text-center">Loading job details...</div>
      </main>
    );
  }

  if (error || !job) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="text-2xl font-semibold">Job not found</h1>
        <p className="mt-4 text-gray-600">
          We couldn't find this job. It may have been removed or the link is incorrect.
        </p>
        <div className="mt-8">
          <Link className="text-blue-600 underline" href="/browse-jobs">
            Back to job list
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-semibold">{job.title}</h1>
      <div className="text-sm text-gray-600 mt-1">
        {job.company && <span>{job.company}</span>}
        {job.company && (job.location || job.region) && <span> • </span>}
        {job.location || job.region || "Anywhere"}
      </div>
      
      {(job.rate || job.pay_min) && (
        <div className="mt-4 text-lg font-semibold text-green-600">
          {job.rate && `₱${job.rate.toLocaleString()}`}
          {!job.rate && job.pay_min && job.pay_max && 
            `₱${job.pay_min.toLocaleString()} - ₱${job.pay_max.toLocaleString()}`}
        </div>
      )}

      <div className="mt-6 whitespace-pre-wrap">
        {job.description || "No description available."}
      </div>

      <div className="mt-6 flex items-center gap-3">
        <ApplyButton
          href="/applications"
          jobId={job.id}
          title={job.title}
        />
      </div>

      <div className="mt-8">
        <Link className="text-blue-600 underline" href="/browse-jobs">
          Back to list
        </Link>
      </div>
    </main>
  );
}

