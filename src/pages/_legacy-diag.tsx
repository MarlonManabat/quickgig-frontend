import * as React from 'react';
import { legacyEnabled, getOverrideSource } from '../lib/legacy';

type SelfTest = {
  env: Record<string,string | undefined>;
  files: Record<string, { exists:boolean; size?:number; sha256?:string; first200?:string }>;
  alerts: string[];
};

export default function LegacyDiagPage() {
  const [data, setData] = React.useState<SelfTest | null>(null);
  const [err, setErr] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetch('/api/legacy-selftest').then(r => r.json()).then(setData).catch(e => setErr(String(e)));
  }, []);

  const on = legacyEnabled();
  const src = getOverrideSource();

  const setLS = (v: '1'|'0'|null) => {
    if (v === null) localStorage.removeItem('legacy_ui');
    else localStorage.setItem('legacy_ui', v);
    location.reload();
  };

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
        Quick links: <a href="/?legacy=1">/?legacy=1</a> · <a href="/login?legacy=1">/login?legacy=1</a>
      </p>
      {err && <pre style={{color:'crimson'}}>{err}</pre>}
      {!data ? <p>Loading…</p> : (
        <>
          <h2>Environment</h2>
          <pre>{JSON.stringify(data.env, null, 2)}</pre>
          <h2>Files</h2>
          <pre>{JSON.stringify(data.files, null, 2)}</pre>
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
