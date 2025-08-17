import * as React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import type { GetStaticProps } from 'next';
import { legacyFlagFromEnv, legacyFlagFromQuery } from '../src/lib/legacyFlag';

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
  React.useEffect(() => {
    try { setUseLegacy(legacyFlagFromEnv() || legacyFlagFromQuery(new URL(window.location.href).searchParams)); } catch {}
  }, []);
  return (
    <>
      <Head><title>QuickGig</title></Head>
      {useLegacy && legacyHtml
        ? <main dangerouslySetInnerHTML={{ __html: legacyHtml }} />
        : <main style={{ padding: 24, fontFamily: 'ui-sans-serif,system-ui' }}>
            <h1>QuickGig</h1>
            <p>
              Root page is live. Turn on the legacy shell via <code>NEXT_PUBLIC_LEGACY_UI=true</code> or visit <Link href="/?legacy=1">/?legacy=1</Link>.
            </p>
          </main>}
    </>
  );
}
