import * as React from 'react';
import Head from 'next/head';
import fs from 'fs';
import path from 'path';
import type { GetStaticProps } from 'next';
import { legacyFlagFromEnv, legacyFlagFromQuery } from '../src/lib/legacyFlag';
import { NavBar } from '../src/components/ui/NavBar';
import { Footer } from '../src/components/ui/Footer';
import { Input } from '../src/components/ui/Input';
import { Button } from '../src/components/ui/Button';
import { tokens as T } from '../src/theme/tokens';
import { Auth } from '../src/lib/apiClient';
import { Banner } from '../src/components/ui/Banner';

type Props = { legacyHtml?: string };

export const getStaticProps: GetStaticProps<Props> = async () => {
  try {
    const pub = path.join(process.cwd(), 'public', 'legacy');
    const frag = fs.readFileSync(path.join(pub, 'login.fragment.html'), 'utf8');
    const legacyHtml =
`<link rel="preload" as="font" href="/legacy/fonts/LegacySans.woff2" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/legacy/styles.css">
${frag}`;
    return { props: { legacyHtml }, revalidate: 300 };
  } catch {
    return { props: {}, revalidate: 60 };
  }
};

export default function Login({ legacyHtml }: Props){
  const [useLegacy, setUseLegacy] = React.useState(() => legacyFlagFromEnv());
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [err, setErr] = React.useState<string>('');
  const [busy, setBusy] = React.useState(false);
  React.useEffect(() => { try { setUseLegacy(legacyFlagFromEnv() || legacyFlagFromQuery(new URL(window.location.href).searchParams)); } catch {} }, []);
  if(useLegacy && legacyHtml){ return <div dangerouslySetInnerHTML={{__html: legacyHtml}} />; }
  async function onSubmit(e: React.FormEvent){ e.preventDefault(); setErr(''); setBusy(true);
    if(!email || !password){ setErr('Please enter your email and password.'); setBusy(false); return; }
    try { await Auth.login(email, password); location.href='/'; }
    catch(e: unknown){ const msg = (e as { message?: string }).message; setErr(msg || 'Login failed'); }
    finally{ setBusy(false); }
  }

  return (
    <>
      <Head><title>Log In · QuickGig</title></Head>
      <Banner />
      <NavBar />
      <main style={{fontFamily:T.font.base, color:T.colors.text}}>
        <section style={{maxWidth:420, margin:'40px auto', padding:'0 16px'}}>
          <div style={{textAlign:'center', marginBottom:16}}>
            <img alt="QuickGig" src="/legacy/img/logo-main.png" width="80" height="80"/>
          </div>
          <form onSubmit={onSubmit} style={{display:'grid', gap:12}}>
            <Input type="email" label="Email" value={email} onChange={e=>setEmail(e.target.value)} />
            <Input type="password" label="Password" value={password} onChange={e=>setPassword(e.target.value)} />
            {err && <div style={{color:T.colors.danger, fontSize:14}}>{err}</div>}
            <Button type="submit" disabled={busy} full>{busy?'Logging in…':'Log in'}</Button>
            <div style={{fontSize:14, color:T.colors.subtext, textAlign:'center'}}>No account? <a href="/register" style={{color:T.colors.link}}>Sign up</a></div>
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
}
