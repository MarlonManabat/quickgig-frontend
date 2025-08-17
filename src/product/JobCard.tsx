import * as React from 'react';
import Link from 'next/link';
import { tokens as T } from '../theme/tokens';
import type { JobSummary } from '../lib/api';
import { useSavedJobs } from './useSavedJobs';

export function JobCard({ job }: { job: JobSummary }) {
  const { isSaved, toggle } = useSavedJobs();
  const saved = isSaved(String(job.id));
  return (
    <div
      style={{
        display: 'grid',
        gap: 8,
        background: '#fff',
        border: `1px solid ${T.colors.border}`,
        borderRadius: T.radius.lg,
        padding: 16,
        boxShadow: T.shadow.sm,
        position: 'relative',
      }}
    >
      <button
        aria-label={saved ? 'Unsave job' : 'Save job'}
        onClick={() => toggle(String(job.id))}
        style={{
          position: 'absolute',
          top: 8,
          right: 8,
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          fontSize: 18,
        }}
        title={saved ? 'Unsave' : 'Save'}
      >
        {saved ? '♥' : '♡'}
      </button>
      <Link
        href={`/jobs/${job.id}`}
        style={{ fontWeight: 600, textDecoration: 'none', color: T.colors.text }}
      >
        {job.title}
      </Link>
      {job.company && (
        <div style={{ color: T.colors.subtle, fontSize: 14 }}>{job.company}</div>
      )}
      <div
        style={{
          display: 'flex',
          gap: 12,
          marginTop: 8,
          color: T.colors.subtle,
          fontSize: 13,
        }}
      >
        {job.location && <span>📍 {job.location}</span>}
        {job.payRange && <span>💰 {job.payRange}</span>}
      </div>
      <div style={{ marginTop: 8 }}>
        <Link
          href={`/jobs/${job.id}/apply`}
          style={{
            padding: '8px 12px',
            borderRadius: 8,
            background: T.colors.brand,
            color: '#fff',
            textDecoration: 'none',
            fontWeight: 600,
          }}
        >
          Apply
        </Link>
      </div>
    </div>
  );
}

export function JobGrid({ jobs }: { jobs: JobSummary[] }) {
  return (
    <div style={{display:'grid', gap:12, gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))'}}>
      {jobs.map(j => <JobCard key={String(j.id)} job={j} />)}
    </div>
  );
}

