import * as React from 'react';
import type { GetServerSideProps } from 'next';
import Link from 'next/link';
import path from 'path';
import fs from 'fs';
import ProductShell from '../../../src/components/layout/ProductShell';
import { HeadSEO } from '../../../src/components/HeadSEO';
import { getJobDetails, type JobDetail } from '../../../src/lib/api';
import { legacyFlagFromEnv, legacyFlagFromQuery } from '../../../src/lib/legacyFlag';
import { tokens as T } from '../../../src/theme/tokens';

type Props = { job: JobDetail|null; legacyHtml?: string };

export const getServerSideProps: GetServerSideProps<Props> = async ({ params }) => {
  const id = String(params?.id ?? '');
  const job = await getJobDetails(id);
  let legacyHtml: string|undefined;
  try {
    const pub = path.join(process.cwd(),'public','legacy');
    const frag = fs.readFileSync(path.join(pub,'login.fragment.html'),'utf8'); // reuse login shell as fallback
    legacyHtml = `<link rel="preload" as="font" href="/legacy/fonts/LegacySans.woff2" type="font/woff2" crossOrigin />
<link rel="stylesheet" href="/legacy/styles.css" />` + frag;
  } catch {}
  return { props: { job, legacyHtml } };
};

export default function ApplyPage({ job, legacyHtml }: Props) {
  const [useLegacy, setUseLegacy] = React.useState(false);
  React.useEffect(() => {
    try { setUseLegacy(legacyFlagFromEnv() || legacyFlagFromQuery(new URL(window.location.href).searchParams)); } catch {}
  }, []);
  if (useLegacy && legacyHtml) return <div dangerouslySetInnerHTML={{__html: legacyHtml}} />;

  return (
    <ProductShell>
      <HeadSEO title={job ? `Apply • ${job.title} • QuickGig` : 'Apply • QuickGig'} />
      <section style={{display:'grid', gap:16}}>
        {job ? (
          <header style={{display:'grid', gap:4}}>
            <h1 style={{margin:0}}>{job.title}</h1>
            <div style={{color:T.colors.subtle}}>
              {job.company ? `${job.company} • ` : ''}{job.location || 'Anywhere'}{job.payRange ? ` • ${job.payRange}`:''}
            </div>
          </header>
        ) : (
          <h1>Apply</h1>
        )}

        <ApplyForm jobId={String(job?.id ?? '')} />
      </section>
    </ProductShell>
  );
}

function field(label:string, el:React.ReactNode) {
  return (
    <label style={{display:'grid', gap:6}}>
      <span style={{fontWeight:600}}>{label}</span>
      {el}
    </label>
  );
}

function ApplyForm({ jobId }: { jobId: string }) {
  const [name,setName] = React.useState('');
  const [email,setEmail] = React.useState('');
  const [message,setMessage] = React.useState('');
  const [status,setStatus] = React.useState<'idle'|'sending'|'ok'|'err'>('idle');
  const disabled = !jobId || !name || !email || status==='sending';

  async function onSubmit(e:React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    try {
      const r = await fetch('/api/apply', {
        method:'POST',
        headers:{'content-type':'application/json'},
        body: JSON.stringify({ jobId, name, email, message }),
      });
      const j = await r.json().catch(()=>({}));
      if (r.ok) setStatus('ok'); else setStatus('err');
      if (!r.ok) console.error('apply failed', j);
    } catch {
      setStatus('err');
    }
  }

  return (
    <form onSubmit={onSubmit}
      style={{background:'#fff', border:`1px solid ${T.colors.border}`, borderRadius:12, padding:16, display:'grid', gap:12, maxWidth:560}}>
      {field('Full name',
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Juan Dela Cruz"
               style={{padding:'10px 12px', borderRadius:8, border:`1px solid ${T.colors.border}`}} />
      )}
      {field('Email',
        <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"
               style={{padding:'10px 12px', borderRadius:8, border:`1px solid ${T.colors.border}`}} />
      )}
      {field('Message (optional)',
        <textarea value={message} onChange={e=>setMessage(e.target.value)} rows={5}
                  placeholder="Short note to the employer"
                  style={{padding:'10px 12px', borderRadius:8, border:`1px solid ${T.colors.border}`, resize:'vertical'}} />
      )}

      <div style={{display:'flex', gap:8}}>
        <button type="submit" disabled={disabled}
          style={{padding:'10px 14px', borderRadius:8, background: disabled? '#9aa5b1': T.colors.brand, color:'#fff',
                  border:'none', fontWeight:700, cursor: disabled? 'not-allowed':'pointer'}}>
          {status==='sending' ? 'Sending…' : 'Submit application'}
        </button>
        <Link href="/login" style={{padding:'10px 14px', borderRadius:8, border:`1px solid ${T.colors.border}`, textDecoration:'none'}}>Sign in</Link>
      </div>

      {status==='ok' && <p role="status" style={{color:'green', margin:0}}>Thanks! Your application was received.</p>}
      {status==='err' && <p role="status" style={{color:'crimson', margin:0}}>Something went wrong. Please try again.</p>}
    </form>
  );
}
