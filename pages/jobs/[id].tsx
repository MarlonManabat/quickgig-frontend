import * as React from 'react';
import type { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import path from 'path';
import fs from 'fs';
import ProductShell from '../../src/components/layout/ProductShell';
import { HeadSEO } from '../../src/components/HeadSEO';
import { legacyFlagFromEnv, legacyFlagFromQuery } from '../../src/lib/legacyFlag';
import { getJobDetails, type JobDetail } from '../../src/lib/api';
import { tokens as T } from '../../src/theme/tokens';
import { useSavedJobs } from '../../src/product/useSavedJobs';
import { t } from '../../src/lib/t';
import { isApplied } from '../../src/lib/appliedStore';
import { useSession } from '../../src/hooks/useSession';

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
  const { isSaved, toggle } = useSavedJobs();
  const { session } = useSession();
  const [applied, setApplied] = React.useState(false);
  const [useLegacy, setUseLegacy] = React.useState(false);
  const router = useRouter();
  React.useEffect(() => {
    try { setUseLegacy(legacyFlagFromEnv() || legacyFlagFromQuery(new URL(window.location.href).searchParams)); } catch {} 
  }, []);
  React.useEffect(() => { if (job) setApplied(isApplied(job.id)); }, [job]);
  if (useLegacy && legacyHtml) return <div dangerouslySetInnerHTML={{__html: legacyHtml}} />;

  if (!job) {
    return (
      <ProductShell>
        <HeadSEO titleKey="not_found" descKey="search_title" />
        <div style={{background:'#fff', border:`1px solid ${T.colors.border}`, padding:16, borderRadius:8}}>
          {t('not_found')}
        </div>
      </ProductShell>
    );
  }

  const saved = isSaved(String(job.id));
  return (
    <ProductShell>
      <HeadSEO title={job.title} descKey="search_title" />
      <article style={{background:'#fff', border:`1px solid ${T.colors.border}`, borderRadius:12, padding:20, display:'grid', gap:12}}>
        <div style={{display:'flex', alignItems:'center', gap:12}}>
          <h1 style={{margin:'0 0 4px'}}>{job.title}</h1>
          <button
            aria-label={saved ? 'Unsave job' : 'Save job'}
            onClick={() => toggle(String(job.id))}
            style={{border:'none', background:'transparent', cursor:'pointer', fontSize:22}}
            title={saved ? 'Unsave' : 'Save'}
          >{saved ? '♥' : '♡'}</button>
        </div>
        <div style={{color:T.colors.subtle}}>
          {job.company ? `${job.company} • ` : ''}{job.location || 'Anywhere'}{job.payRange ? ` • ${job.payRange}`:''}
        </div>
        {applied && !session && (
          <p style={{background:'#fffbe6', border:`1px solid ${T.colors.border}`, padding:12, borderRadius:8}}>
            Gusto mo i-save ang application? <Link href={`/login?next=${encodeURIComponent(router.asPath)}`}><strong>Mag-sign in</strong></Link> para ma-track.
          </p>
        )}
        {job.description ? (
          <div style={{whiteSpace:'pre-wrap', lineHeight:1.6}}>{job.description}</div>
        ) : (
          <div style={{color:T.colors.subtle}}>No description provided.</div>
        )}
        <div style={{display:'flex', gap:8}}>
          <Link href="/login" style={{padding:'10px 14px', borderRadius:8, background:T.colors.brand, color:'#fff', textDecoration:'none', fontWeight:700}}>{t('job_apply')}</Link>
          <Link href="/find-work" style={{padding:'10px 14px', borderRadius:8, border:`1px solid ${T.colors.border}`, background:'#fff', textDecoration:'none'}}>Back to search</Link>
        </div>
      </article>
    </ProductShell>
  );
}
