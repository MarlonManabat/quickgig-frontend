import * as React from 'react';
import Head from 'next/head';
import fs from 'fs';
import path from 'path';
import type { GetStaticProps } from 'next';
import { legacyFlagFromEnv, legacyFlagFromQuery } from '../src/lib/legacyFlag';
import { NavBar } from '../src/components/ui/NavBar';
import { Footer } from '../src/components/ui/Footer';
import { Button } from '../src/components/ui/Button';
import { tokens as T } from '../src/theme/tokens';
import { Banner } from '../src/components/ui/Banner';

type Props = { legacyHtml?: string };

export const getStaticProps: GetStaticProps<Props> = async () => {
  try {
    const pub = path.join(process.cwd(), 'public', 'legacy');
    const frag = fs.readFileSync(path.join(pub, 'index.fragment.html'), 'utf8');
    const legacyHtml =
`<link rel="preload" as="font" href="/legacy/fonts/LegacySans.woff2" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/legacy/styles.css">
${frag}`;
    return { props: { legacyHtml }, revalidate: 300 };
  } catch {
    return { props: {}, revalidate: 60 };
  }
};

export default function Home({ legacyHtml }: Props){
  const [useLegacy, setUseLegacy] = React.useState(() => legacyFlagFromEnv());
  React.useEffect(() => { try { setUseLegacy(legacyFlagFromEnv() || legacyFlagFromQuery(new URL(window.location.href).searchParams)); } catch {} }, []);
  if(useLegacy && legacyHtml){ return <div dangerouslySetInnerHTML={{__html: legacyHtml}} />; }

  return (
    <>
      <Head><title>QuickGig · Find Gigs Fast in the Philippines</title></Head>
      <Banner />
      <NavBar />
      <main style={{fontFamily:T.font.base, color:T.colors.text}}>
        <section style={{maxWidth:1024, margin:'0 auto', padding:'48px 16px', display:'grid', gridTemplateColumns:'1.2fr .8fr', gap:24}}>
          <div>
            <h1 style={{fontSize:36, marginBottom:12}}>Find gigs fast.</h1>
            <p style={{color:T.colors.subtext, fontSize:18, marginBottom:20}}>Browse fresh opportunities and start working without the usual hassle.</p>
            <div style={{display:'flex', gap:12}}>
              <a href="/register"><Button>Get started</Button></a>
              <a href="/find-work"><Button variant="outline">Find work</Button></a>
            </div>
          </div>
          <div>
            <img alt="QuickGig" src="/legacy/img/logo-main.png" style={{width:'100%', maxWidth:380}} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
