import * as React from 'react';
import { tokens as T } from '../theme/tokens';
import type { JobSummary } from '../lib/api';

export function JobCard({ job }: { job: JobSummary }) {
  const href = job.url ?? (job.id ? `/jobs/${job.id}` : '#');
  return (
    <a href={href} style={{
      display:'block', textDecoration:'none', color:T.colors.text,
      background:'#fff', border:`1px solid ${T.colors.border}`,
      borderRadius: T.radius.lg, padding:16, boxShadow: T.shadow.sm
    }}>
      <div style={{fontWeight:600, marginBottom:6}}>{job.title}</div>
      {job.company && <div style={{color:T.colors.subtle, fontSize:14}}>{job.company}</div>}
      <div style={{display:'flex', gap:12, marginTop:8, color:T.colors.subtle, fontSize:13}}>
        {job.location && <span>📍 {job.location}</span>}
        {job.payRange && <span>💰 {job.payRange}</span>}
      </div>
    </a>
  );
}

export function JobGrid({ jobs }: { jobs: JobSummary[] }) {
  if (!jobs.length) return null;
  return (
    <section style={{display:'grid', gap:16, gridTemplateColumns:'repeat(auto-fill, minmax(240px, 1fr))'}}>
      {jobs.map(j => <JobCard key={String(j.id)} job={j} />)}
    </section>
  );
}

