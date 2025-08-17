import * as React from 'react';
import { HeadSEO } from '../src/components/HeadSEO';
import fs from 'fs';
import path from 'path';
import ProductShell from '../src/product/layout/ProductShell';
import { Card } from '../src/product/ui/Card';
import { Button } from '../src/product/ui/Button';
import { tokens as T } from '../src/theme/tokens';
import { JobGrid } from '../src/product/JobCard';
import { featuredJobs, type JobSummary } from '../src/lib/api';
import { legacyFlagFromEnv, legacyFlagFromQuery } from '../src/lib/legacyFlag';

type Props = { legacyHtml?: string; jobs: JobSummary[] };
export async function getStaticProps() {
  try {
    const pub = path.join(process.cwd(),'public','legacy');
    const frag = fs.readFileSync(path.join(pub,'index.fragment.html'),'utf8');
    const legacyHtml = `<link rel="preload" as="font" href="/legacy/fonts/LegacySans.woff2" type="font/woff2" crossOrigin />\n<link rel="stylesheet" href="/legacy/styles.css" />` + frag;
    const jobs = await featuredJobs(8).catch(()=>[]);
    return { props: { legacyHtml, jobs }, revalidate: 180 };
  } catch {
    const jobs = await featuredJobs(8).catch(()=>[]);
    return { props: { jobs }, revalidate: 300 };
  }
}
export default function Home({ legacyHtml, jobs }: Props){
  const [useLegacy,setUseLegacy]=React.useState<boolean>(false);
  React.useEffect(()=>{ try{ setUseLegacy(legacyFlagFromEnv() || legacyFlagFromQuery(new URL(window.location.href).searchParams)); }catch{} },[]);
  if(useLegacy && legacyHtml){
    return (<div dangerouslySetInnerHTML={{__html: legacyHtml}}/>);
  }
  return (
    <>
      <HeadSEO title="QuickGig • Find Gigs Fast" canonical="/" />
      <ProductShell>
        <div style={{display:'grid', gap:16}}>
          <Card>
            <h1 style={{fontFamily:T.font.ui, fontSize:28, margin:'0 0 8px'}}>Find gigs fast in the Philippines</h1>
            <p style={{color:T.colors.subtle, margin:'0 0 16px'}}>Search flexible work and apply in minutes.</p>
            <div style={{display:'flex', gap:12}}>
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a href="/find-work"><Button>Browse jobs</Button></a>
              <a href="/register"><Button variant="subtle">Create account</Button></a>
            </div>
          </Card>
          {/* Featured jobs */}
          {jobs?.length ? (
            <section>
              <h2 style={{margin:'8px 0 12px', fontSize:20}}>Featured jobs</h2>
              <JobGrid jobs={jobs}/>
            </section>
          ) : null}
        </div>
      </ProductShell>
    </>
  );
}
