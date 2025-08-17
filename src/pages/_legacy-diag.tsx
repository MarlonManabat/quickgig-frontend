import { useEffect, useState } from 'react';
import { legacyEnabled, getOverrideSource, setLegacyOverride, clearLegacyOverride } from '@/lib/legacy';

interface SelfTest {
  env: Record<string, string | null>;
  overrideSource: string;
  index: { exists: boolean };
  login: { exists: boolean };
  styles: { exists: boolean };
  font: { exists: boolean };
  alerts: string[];
  [key: string]: unknown;
}

export default function LegacyDiag() {
  const [data, setData] = useState<SelfTest | null>(null);

  useEffect(() => {
    legacyEnabled();
    fetch('/api/legacy-selftest').then(r => r.json()).then(setData);
  }, []);

  return (
    <div style={{ fontFamily: 'monospace', padding: 20 }}>
      <h1>Legacy Diagnostics</h1>
      <section>
        <p>NEXT_PUBLIC_LEGACY_UI: {process.env.NEXT_PUBLIC_LEGACY_UI}</p>
        <p>NEXT_PUBLIC_LEGACY_STRICT_SHELL: {process.env.NEXT_PUBLIC_LEGACY_STRICT_SHELL}</p>
        <p>NEXT_PUBLIC_SHOW_API_BADGE: {process.env.NEXT_PUBLIC_SHOW_API_BADGE}</p>
        <p>override source: {getOverrideSource()}</p>
      </section>
      <section style={{ marginTop: 20 }}>
        <button onClick={() => setLegacyOverride('1')}>Force Legacy ON</button>{' '}
        <button onClick={() => setLegacyOverride('0')}>Force Legacy OFF</button>{' '}
        <button onClick={clearLegacyOverride}>Clear Override</button>
      </section>
      <section style={{ marginTop: 20 }}>
        <a href="/?legacy=1">/?legacy=1</a> | <a href="/login?legacy=1">/login?legacy=1</a>
      </section>
      <section style={{ marginTop: 20 }}>
        {data ? (
          <>
            <ul>
              {['index', 'login', 'styles', 'font'].map((k) => (
                <li key={k}>
                  {k}: {data[k]?.exists ? '✅' : '❌'}
                </li>
              ))}
            </ul>
            {data.alerts.length > 0 && (
              <div>
                Alerts:
                <ul>
                  {data.alerts.map((a) => (
                    <li key={a}>❌ {a}</li>
                  ))}
                </ul>
              </div>
            )}
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </section>
    </div>
  );
}

export async function getServerSideProps() {
  if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_ENABLE_LEGACY_DIAG !== 'true') {
    return { notFound: true };
  }
  return { props: {} };
}
