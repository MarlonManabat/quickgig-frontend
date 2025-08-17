import * as React from 'react';
import Link from 'next/link';
import { legacyEnabled, getOverrideSource } from '../lib/legacy';

/**
 * Access rules:
 * - Non-production: always accessible.
 * - Production: accessible if URL has ?diag=1 OR NEXT_PUBLIC_ENABLE_LEGACY_DIAG === "true".
 */
function useDiagAllowed() {
  const [allowed, setAllowed] = React.useState<boolean>(false);
  React.useEffect(() => {
    const env = String(process.env.NEXT_PUBLIC_ENABLE_LEGACY_DIAG || '').toLowerCase() === 'true';
    try {
      const url = new URL(window.location.href);
      const qp = url.searchParams.get('diag') === '1';
      const isProd = process.env.NODE_ENV === 'production';
      setAllowed(!isProd || qp || env);
    } catch {
      setAllowed(true);
    }
  }, []);
  return allowed;
}

type SelfTest = {
  env: Record<string,string | undefined>;
  files: Record<string, { exists:boolean; url?:string; httpStatus?:number; size?:number; sha256?:string; first200?:string }>;
  alerts: string[];
};

export default function LegacyDiagPage() {
  const allowed = useDiagAllowed();
  const [data, setData] = React.useState<SelfTest | null>(null);
  const [err, setErr] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!allowed) return;
    fetch('/api/legacy-selftest').then(r => r.json()).then(setData).catch(e => setErr(String(e)));
  }, [allowed]);

  const on = legacyEnabled();
  const src = getOverrideSource();

  const setLS = (v: '1'|'0'|null) => {
    if (v === null) localStorage.removeItem('legacy_ui');
    else localStorage.setItem('legacy_ui', v);
    location.reload();
  };

  if (!allowed) {
    return (
      <main style={{fontFamily:'ui-sans-serif, system-ui', padding:'24px', maxWidth:900, margin:'0 auto'}}>
        <h1 style={{fontSize:28, fontWeight:700}}>Diagnostics disabled</h1>
        <p>Append <code>?diag=1</code> to the URL (or set <code>NEXT_PUBLIC_ENABLE_LEGACY_DIAG=true</code>) to view this page in production.</p>
      </main>
    );
  }

  return (
    <main style={{fontFamily:'ui-sans-serif, system-ui', padding:'24px', maxWidth:900, margin:'0 auto'}}>
      <h1 style={{fontSize:28, fontWeight:700}}>Legacy Diagnostics</h1>
      <p>Legacy enabled: <strong>{on ? 'true' : 'false'}</strong> (source: <code>{src}</code>)</p>
      <div style={{display:'flex', gap:8, margin:'12px 0'}}>
        <button onClick={() => setLS('1')}>Force Legacy ON</button>
        <button onClick={() => setLS('0')}>Force Legacy OFF</button>
        <button onClick={() => setLS(null)}>Clear Override</button>
      </div>
      <p>
        Quick links: <Link href="/?legacy=1">/?legacy=1</Link> · <Link href="/login?legacy=1">/login?legacy=1</Link> · <Link href="/legacy-diag?diag=1">/legacy-diag?diag=1</Link>
      </p>
      {err && <pre style={{color:'crimson'}}>{err}</pre>}
      {!data ? <p>Loading…</p> : (
        <>
          <h2>Environment</h2>
          <pre>{JSON.stringify(data.env, null, 2)}</pre>
          <h2>Files</h2>
          <table style={{borderCollapse:'collapse', width:'100%'}}>
            <thead>
              <tr>
                <th style={{textAlign:'left', borderBottom:'1px solid #ddd', padding:'6px'}}>Path</th>
                <th style={{textAlign:'left', borderBottom:'1px solid #ddd', padding:'6px'}}>Exists</th>
                <th style={{textAlign:'left', borderBottom:'1px solid #ddd', padding:'6px'}}>HTTP</th>
                <th style={{textAlign:'left', borderBottom:'1px solid #ddd', padding:'6px'}}>Size</th>
                <th style={{textAlign:'left', borderBottom:'1px solid #ddd', padding:'6px'}}>SHA256</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(data.files).map(([k,v])=>(
                <tr key={k}>
                  <td style={{padding:'6px'}}><code>{k}</code>{v.url ? <> — <a href={v.url} target="_blank" rel="noreferrer">open</a></> : null}</td>
                  <td style={{padding:'6px'}}>{v.exists ? '✅' : '❌'}</td>
                  <td style={{padding:'6px'}}>{v.httpStatus ?? '-'}</td>
                  <td style={{padding:'6px'}}>{typeof v.size==='number' ? v.size : '-'}</td>
                  <td style={{padding:'6px', wordBreak:'break-all'}}>{v.sha256 ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.alerts.length > 0 ? (
            <div style={{background:'#fff3cd', padding:12, border:'1px solid #ffeeba', borderRadius:8}}>
              <strong>Alerts:</strong>
              <ul>{data.alerts.map((a,i)=><li key={i}>{a}</li>)}</ul>
            </div>
          ) : <p>Alerts: none ✅</p>}
        </>
      )}
    </main>
  );
}
