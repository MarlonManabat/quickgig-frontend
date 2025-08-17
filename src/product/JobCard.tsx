import * as React from 'react';
import Link from 'next/link';
import { tokens as T } from '../theme/tokens';
import type { JobSummary } from '../lib/api';
import { useSavedJobs } from './useSavedJobs';
import { t } from '../lib/t';
import { isApplied } from '../lib/appliedStore';

export function JobCard({ job }: { job: JobSummary }) {
  const { isSaved, toggle } = useSavedJobs();
  const saved = isSaved(String(job.id));
  const applied = isApplied(String(job.id));
  const badge = applied ? t('applied_badge') : saved ? t('saved_badge') : null;
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
      {badge && (
        <span
          style={{
            position: 'absolute',
            top: 8,
            left: 8,
            background: T.colors.brand,
            color: '#fff',
            padding: '2px 6px',
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          {badge}
        </span>
      )}
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
          {t('job_apply')}
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

