import * as React from 'react';
import Head from 'next/head';
import fs from 'fs';
import path from 'path';
import ProductShell from '../src/product/layout/ProductShell';
import { Card } from '../src/product/ui/Card';
import { Input } from '../src/product/ui/Input';
import { Button } from '../src/product/ui/Button';
import { legacyFlagFromEnv, legacyFlagFromQuery } from '../src/lib/legacyFlag';

type Props = { legacyHtml?: string };
export async function getStaticProps() {
  try {
    const pub = path.join(process.cwd(),'public','legacy');
    const frag = fs.readFileSync(path.join(pub,'login.fragment.html'),'utf8');
    const legacyHtml = `<link rel="preload" as="font" href="/legacy/fonts/LegacySans.woff2" type="font/woff2" crossOrigin />\n<link rel="stylesheet" href="/legacy/styles.css" />` + frag;
    return { props: { legacyHtml }, revalidate: 300 };
  } catch { return { props: {}, revalidate: 600 }; }
}
export default function Login({ legacyHtml }: Props){
  const [useLegacy,setUseLegacy]=React.useState<boolean>(false);
  React.useEffect(()=>{ try{ setUseLegacy(legacyFlagFromEnv() || legacyFlagFromQuery(new URL(window.location.href).searchParams)); }catch{} },[]);
  if(useLegacy && legacyHtml){ return (<div dangerouslySetInnerHTML={{__html: legacyHtml}}/>); }
  return (
    <>
      <Head><title>Log in • QuickGig</title></Head>
      <ProductShell>
        <Card style={{maxWidth:520, margin:'0 auto'}}>
          <h2 style={{marginTop:0}}>Log in</h2>
          <form method="post" action="/api/auth">
            <div style={{display:'grid', gap:12}}>
              <label>Email<Input name="email" type="email" required/></label>
              <label>Password<Input name="password" type="password" required/></label>
              <Button type="submit">Log in</Button>
            </div>
          </form>
          <p style={{marginTop:12}}><a href="/register">Need an account?</a></p>
        </Card>
      </ProductShell>
    </>
  );
}
