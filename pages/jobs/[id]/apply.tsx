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
import { t } from '../../../src/lib/t';
import { markApplied } from '../../../src/lib/appliedStore';
import { toJobSummary } from '../../../src/types/job';
import { toast } from '../../../src/lib/toast';
import { useRouter } from 'next/router';
import { getResume, setResume } from '../../../src/lib/profileStore';
import { UploadedFile } from '../../../src/types/upload';
import { toBase64, truncateDataUrl, makeId } from '../../../src/lib/baseUpload';
import { validateFile, MAX_MB } from '../../../src/lib/uploadPolicy';
import { presign, putFile } from '../../../src/lib/uploader';

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
      <HeadSEO title={job ? `${t('job_apply_title')} • ${job.title}` : t('job_apply_title')} descKey="search_title" />
      <section style={{display:'grid', gap:16}}>
        {job ? (
          <header style={{display:'grid', gap:4}}>
            <h1 style={{margin:0}}>{job.title}</h1>
            <div style={{color:T.colors.subtle}}>
              {job.company ? `${job.company} • ` : ''}{job.location || 'Anywhere'}{job.payRange ? ` • ${job.payRange}`:''}
            </div>
          </header>
        ) : (
          <h1>{t('job_apply_title')}</h1>
        )}

        {job && <ApplyForm job={job} />}
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

function ApplyForm({ job }: { job: JobDetail }) {
  const router = useRouter();
  const [name,setName] = React.useState('');
  const [email,setEmail] = React.useState('');
  const [phone,setPhone] = React.useState('');
  const [city,setCity] = React.useState('');
  const [message,setMessage] = React.useState('');
  const [status,setStatus] = React.useState<'idle'|'sending'|'ok'|'err'>('idle');
  const [resume,setResumeState] = React.useState<UploadedFile|null>(null);
  const resumeInput = React.useRef<HTMLInputElement>(null);
  const disabled = !job?.id || !name || !email || status==='sending';

  React.useEffect(() => {
    (async () => {
      try {
        const r = await fetch('/api/account/profile');
        const p = await r.json();
        setName(p.name || '');
        setEmail(p.email || '');
        setPhone(p.phone || '');
        setCity(p.city || '');
      } catch {}
      try { setResumeState(getResume()); } catch {}
    })();
  }, []);

  async function onSubmit(e:React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    try {
      const r = await fetch('/api/apply', {
        method:'POST',
        headers:{'content-type':'application/json'},
        body: JSON.stringify({ jobId: String(job.id), name, email, phone, city, resume, message }),
      });
      const j = await r.json().catch(()=>({}));
      if (r.ok) {
        markApplied(String(job.id), toJobSummary(job));
        toast(t('apply_success'));
        router.push(`/jobs/${job.id}#applied`);
      } else {
        setStatus('err');
        console.error('apply failed', j);
      }
    } catch {
      setStatus('err');
    }
  }

  async function onResumeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const v = validateFile(f);
    if (!v.ok) {
      toast(t(v.reason === 'too_big' ? 'upload.too_big' : 'upload.bad_type', { mb: MAX_MB }));
      return;
    }
    if (process.env.NEXT_PUBLIC_ENABLE_S3_UPLOADS === 'true') {
      try {
        const { url, key } = await presign(f.name, f.type, f.size);
        await putFile(url, f);
        const up: UploadedFile = { key, url: url.split('?')[0], type: f.type, size: f.size };
        setResumeState(up);
        setResume(up);
        toast(t('profile.resume.saved'));
      } catch (e) {
        toast((e as Error).message === 'rate_limited' ? t('upload.rate_limited') : t('upload.failed'));
      }
    } else {
      const dataUrl = await toBase64(f);
      const up: UploadedFile = { key: makeId(), url: truncateDataUrl(dataUrl), type: f.type, size: f.size };
      setResumeState(up);
      setResume(up);
      toast(t('profile.resume.saved'));
    }
  }

  return (
    <form onSubmit={onSubmit}
      style={{background:'#fff', border:`1px solid ${T.colors.border}`, borderRadius:12, padding:16, display:'grid', gap:12, maxWidth:560}}>
      {field(t('field.name'),
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Juan Dela Cruz"
               style={{padding:'10px 12px', borderRadius:8, border:`1px solid ${T.colors.border}`}} />
      )}
      {field(t('field.email'),
        <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"
               style={{padding:'10px 12px', borderRadius:8, border:`1px solid ${T.colors.border}`}} />
      )}
      {field(t('field.phone'),
        <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="0999-000-0000"
               style={{padding:'10px 12px', borderRadius:8, border:`1px solid ${T.colors.border}`}} />
      )}
      {field(t('field.city'),
        <input value={city} onChange={e=>setCity(e.target.value)} placeholder="Quezon City"
               style={{padding:'10px 12px', borderRadius:8, border:`1px solid ${T.colors.border}`}} />
      )}
      {field(t('profile.resume.title'),
        <div style={{display:'flex', alignItems:'center', gap:8}}>
          {resume ? (
            <>
              <span>{t('apply.resume_attached',{name: resume.url.split('/').pop()})}</span>
              <button type="button" onClick={()=>resumeInput.current?.click()} style={{textDecoration:'underline', background:'none', border:'none', color:T.colors.brand, cursor:'pointer'}}>{t('profile.resume.replace')}</button>
            </>
          ) : (
            <button type="button" onClick={()=>resumeInput.current?.click()} style={{padding:'10px 12px', borderRadius:8, border:`1px solid ${T.colors.border}`, background:'#fff', cursor:'pointer'}}>{t('profile.resume.replace')}</button>
          )}
          <input ref={resumeInput} type="file" accept=".pdf,.doc,.docx" style={{display:'none'}} onChange={onResumeChange} />
        </div>
      )}
      <p style={{fontSize:12,color:T.colors.subtle,margin:0}}>{t('apply.resume_optional_hint')}</p>
      {field(t('apply_resume'),
        <textarea value={message} onChange={e=>setMessage(e.target.value)} rows={5}
                  placeholder="Short note to the employer"
                  style={{padding:'10px 12px', borderRadius:8, border:`1px solid ${T.colors.border}`, resize:'vertical'}} />
      )}

      <div style={{display:'flex', gap:8}}>
        <button type="submit" disabled={disabled}
          style={{padding:'10px 14px', borderRadius:8, background: disabled? '#9aa5b1': T.colors.brand, color:'#fff',
                  border:'none', fontWeight:700, cursor: disabled? 'not-allowed':'pointer'}}>
          {status==='sending' ? 'Sending…' : t('apply_submit')}
        </button>
        <Link href="/login" style={{padding:'10px 14px', borderRadius:8, border:`1px solid ${T.colors.border}`, textDecoration:'none'}}>Sign in</Link>
      </div>

      {status==='ok' && <p role="status" style={{color:'green', margin:0}}>{t('apply_success')}</p>}
      {status==='err' && <p role="status" style={{color:'crimson', margin:0}}>{t('apply_error')}</p>}
    </form>
  );
}
