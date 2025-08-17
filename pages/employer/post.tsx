import * as React from 'react';
import path from 'path';
import fs from 'fs';
import ProductShell from '../../src/components/layout/ProductShell';
import { HeadSEO } from '../../src/components/HeadSEO';
import { t } from '../../src/lib/t';
import { requireAuthSSR } from '@/lib/auth';

export const getServerSideProps = requireAuthSSR(['employer', 'admin'], async () => {
  try {
    const pub = path.join(process.cwd(), 'public', 'legacy');
    const frag = fs.readFileSync(path.join(pub, 'index.fragment.html'), 'utf8');
    const legacyHtml = `<link rel="preload" as="font" href="/legacy/fonts/LegacySans.woff2" type="font/woff2" crossOrigin><link rel="stylesheet" href="/legacy/styles.css" />` + frag;
    return { legacyHtml };
  } catch {
    return { legacyHtml: '' };
  }
});

export default function PostJobPage({ legacyHtml }: { legacyHtml:string }) {
  const [submitting, setSubmitting] = React.useState(false);
  const [result, setResult] = React.useState<string | null>(null);
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true); setResult(null);
    const fd = new FormData(e.currentTarget);
    const body = Object.fromEntries(fd.entries());
    try {
      const r = await fetch('/api/post-job', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify(body) });
      const j = await r.json().catch(()=> ({}));
      setResult(r.ok ? 'Submitted ✅' : `Failed: ${j?.error || r.status}`);
      if (r.ok) e.currentTarget.reset();
    } catch {
      setResult('Network error');
    } finally { setSubmitting(false); }
  };
  return (
    <ProductShell>
      <HeadSEO titleKey="employer_post" descKey="employer_post" />
      <h1>{t('employer_post')}</h1>
      <p style={{opacity:.8, marginTop:-8}}>Share your opportunity with QuickGig talent.</p>
      <form onSubmit={onSubmit} style={{display:'grid', gap:12, maxWidth:720}}>
        <label>Title<input name="title" required placeholder="e.g., Part-time Barista" /></label>
        <label>Description<textarea name="description" required rows={6} placeholder="What’s the role, responsibilities, requirements?" /></label>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
          <label>Location<input name="location" placeholder="City / Remote" /></label>
          <label>Category<input name="category" placeholder="e.g., Food Service" /></label>
        </div>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
          <label>Pay min<input name="payMin" type="number" min="0" step="1" placeholder="e.g., 300" /></label>
          <label>Pay max<input name="payMax" type="number" min="0" step="1" placeholder="e.g., 500" /></label>
        </div>
        <label>Tags (comma-separated)<input name="tags" placeholder="weekend, urgent, night-shift" /></label>
        <label>Contact email (optional)<input name="email" type="email" placeholder="you@company.com" /></label>
        <button disabled={submitting} type="submit">{submitting ? 'Submitting…' : 'Submit job'}</button>
        {result && <div role="status" style={{marginTop:4}}>{result}</div>}
      </form>
      {/* If someone forces legacy=1 and HTML exists, still fallback gracefully */}
      {legacyHtml ? <noscript dangerouslySetInnerHTML={{ __html: legacyHtml }} /> : null}
      <style jsx>{`
        input, textarea { width:100%; padding:10px 12px; border:1px solid #e5e7eb; border-radius:10px; font:inherit; }
        label { display:grid; gap:6px; font-weight:500; }
        button { padding:10px 14px; border-radius:10px; border:0; cursor:pointer; }
        button:not(:disabled) { background:#2563eb; color:white; }
        button:disabled { background:#a5b4fc; color:white; cursor:wait; }
      `}</style>
    </ProductShell>
  );
}
