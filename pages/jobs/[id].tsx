import * as React from 'react';
import type { GetServerSideProps } from 'next';
import Link from 'next/link';
import path from 'path';
import fs from 'fs';
import ProductShell from '../../src/components/layout/ProductShell';
import { HeadSEO } from '../../src/components/HeadSEO';
import { legacyFlagFromEnv, legacyFlagFromQuery } from '../../src/lib/legacyFlag';
import { getJobDetails, type JobDetail } from '../../src/lib/api';
import { tokens as T } from '../../src/theme/tokens';

type Props = { job: JobDetail | null; legacyHtml?: string };

export const getServerSideProps: GetServerSideProps<Props> = async ({ params }) => {
  const id = String(params?.id ?? '');
  try {
    const pub = path.join(process.cwd(),'public','legacy');
    const frag = fs.readFileSync(path.join(pub,'index.fragment.html'),'utf8');
    const legacyHtml = `<link rel="preload" as="font" href="/legacy/fonts/LegacySans.woff2" type="font/woff2" crossOrigin />\n<link rel="stylesheet" href="/legacy/styles.css" />` + frag;
    const job = await getJobDetails(id);
    return { props: { job, legacyHtml } };
  } catch {
    return { props: { job: null } };
  }
};

export default function JobDetailsPage({ job, legacyHtml }: Props) {
  const [useLegacy, setUseLegacy] = React.useState(false);
  React.useEffect(() => {
    try { setUseLegacy(legacyFlagFromEnv() || legacyFlagFromQuery(new URL(window.location.href).searchParams)); } catch {}
  }, []);
  if (useLegacy && legacyHtml) return <div dangerouslySetInnerHTML={{__html: legacyHtml}} />;

  if (!job) {
    return (
      <ProductShell>
        <HeadSEO title="Job not found • QuickGig" />
        <div style={{background:'#fff', border:`1px solid ${T.colors.border}`, padding:16, borderRadius:8}}>
          Job not found.
        </div>
      </ProductShell>
    );
  }

  return (
    <ProductShell>
      <HeadSEO title={`${job.title} • QuickGig`} />
      <article style={{background:'#fff', border:`1px solid ${T.colors.border}`, borderRadius:12, padding:20, display:'grid', gap:12}}>
        <h1 style={{margin:'0 0 4px'}}>{job.title}</h1>
        <div style={{color:T.colors.subtle}}>
          {job.company ? `${job.company} • ` : ''}{job.location || 'Anywhere'}{job.payRange ? ` • ${job.payRange}`:''}
        </div>
        {job.description ? (
          <div style={{whiteSpace:'pre-wrap', lineHeight:1.6}}>{job.description}</div>
        ) : (
          <div style={{color:T.colors.subtle}}>No description provided.</div>
        )}
        <div style={{display:'flex', gap:8}}>
          <Link href="/login" style={{padding:'10px 14px', borderRadius:8, background:T.colors.brand, color:'#fff', textDecoration:'none', fontWeight:700}}>Apply now</Link>
          <Link href="/find-work" style={{padding:'10px 14px', borderRadius:8, border:`1px solid ${T.colors.border}`, background:'#fff', textDecoration:'none'}}>Back to search</Link>
        </div>
      </article>
    </ProductShell>
  );
}
