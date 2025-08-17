import * as React from 'react';
import type { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import ProductShell from '../src/components/layout/ProductShell';
import { HeadSEO } from '../src/components/HeadSEO';
import { tokens as T } from '../src/theme/tokens';
import { searchJobs, type JobSummary } from '../src/lib/api';
import { JobGrid } from '../src/product/JobCard';
import { legacyFlagFromEnv, legacyFlagFromQuery } from '../src/lib/legacyFlag';
import fs from 'fs';
import path from 'path';

type Props = {
  jobs: JobSummary[];
  q: string;
  location: string;
  page: number;
  total?: number;
  legacyHtml?: string;
};

export const getServerSideProps: GetServerSideProps<Props> = async ({ query }) => {
  try {
    // legacy shell fallback content (only used when forced on)
    const pub = path.join(process.cwd(),'public','legacy');
    const frag = fs.readFileSync(path.join(pub,'index.fragment.html'),'utf8');
    const legacyHtml = `<link rel="preload" as="font" href="/legacy/fonts/LegacySans.woff2" type="font/woff2" crossOrigin />\n<link rel="stylesheet" href="/legacy/styles.css" />` + frag;

    const q = typeof query.q === 'string' ? query.q : '';
    const location = typeof query.location === 'string' ? query.location : '';
    const page = Number(query.page ?? 1) || 1;

    const { items, total } = await searchJobs({ q, location, page, limit: 20 });
    return { props: { jobs: items, total, q, location, page, legacyHtml } };
  } catch {
    return { props: { jobs: [], q: '', location: '', page: 1 } };
  }
};

export default function FindWorkPage(props: Props) {
  const router = useRouter();
  const [useLegacy, setUseLegacy] = React.useState(false);
  React.useEffect(() => {
    try { setUseLegacy(legacyFlagFromEnv() || legacyFlagFromQuery(new URL(window.location.href).searchParams)); } catch {}
  }, []);
  if (useLegacy && props.legacyHtml) {
    return (<div dangerouslySetInnerHTML={{ __html: props.legacyHtml }} />);
  }

  const { q, location, page, total } = props;

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const nextQ = String(fd.get('q') || '');
    const nextLoc = String(fd.get('location') || '');
    router.push({ pathname: '/find-work', query: { q: nextQ, location: nextLoc, page: 1 } });
  }

  const nextPage = () => router.push({ pathname: '/find-work', query: { q, location, page: page + 1 } });
  const prevPage = () => router.push({ pathname: '/find-work', query: { q, location, page: Math.max(1, page - 1) } });

  return (
    <ProductShell>
      <HeadSEO title="Find Work • QuickGig" canonical="/find-work" />
      <section style={{ display:'grid', gap:16 }}>
          <form onSubmit={submit} style={{
            display:'grid', gap:12, gridTemplateColumns:'1fr 1fr auto',
            alignItems:'end', background:'#fff', border:`1px solid ${T.colors.border}`,
            padding:16, borderRadius:T.radius.lg, boxShadow:T.shadow.sm
          }}>
            <label style={{display:'grid', gap:6}}>
              <span style={{fontSize:13, color:T.colors.subtle}}>Keywords</span>
              <input name="q" defaultValue={q} placeholder="e.g. cashier, data entry"
                style={{border:`1px solid ${T.colors.border}`, borderRadius:8, padding:'10px 12px'}} />
            </label>
            <label style={{display:'grid', gap:6}}>
              <span style={{fontSize:13, color:T.colors.subtle}}>Location</span>
              <input name="location" defaultValue={location} placeholder="e.g. Manila, Cebu"
                style={{border:`1px solid ${T.colors.border}`, borderRadius:8, padding:'10px 12px'}} />
            </label>
            <button type="submit" style={{
              height:40, padding:'0 14px', borderRadius:8, border:'none',
              background:T.colors.brand, color:'#fff', fontWeight:600
            }}>Search</button>
          </form>

          {props.jobs.length ? (
            <>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <h2 style={{margin:'8px 0'}}>Results</h2>
                {typeof total === 'number' && <div style={{color:T.colors.subtle, fontSize:13}}>
                  Page {page}{total ? ` • ~${total} jobs` : ''}</div>}
              </div>
              <JobGrid jobs={props.jobs} />
              <div style={{display:'flex', gap:8, justifyContent:'center', marginTop:8}}>
                <button onClick={prevPage} disabled={page<=1}
                  style={{padding:'8px 12px', border:`1px solid ${T.colors.border}`, background:'#fff', borderRadius:8}}>
                  ← Prev
                </button>
                <button onClick={nextPage}
                  style={{padding:'8px 12px', border:`1px solid ${T.colors.border}`, background:'#fff', borderRadius:8}}>
                  Next →
                </button>
              </div>
            </>
          ) : (
            <div style={{
              background:'#fff', border:`1px solid ${T.colors.border}`, padding:16,
              borderRadius:8, color:T.colors.subtle
            }}>
              No jobs found. Try different keywords or locations.
            </div>
          )}
      </section>
    </ProductShell>
  );
}
