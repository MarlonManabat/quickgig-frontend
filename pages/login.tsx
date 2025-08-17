/* eslint-disable @next/next/no-html-link-for-pages */
import * as React from 'react';
import Head from 'next/head';
import fs from 'fs';
import path from 'path';
import type { GetStaticProps } from 'next';
import { legacyFlagFromEnv, legacyFlagFromQuery } from '../src/lib/legacyFlag';

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
  React.useEffect(() => {
    try {
      const params = new URL(window.location.href).searchParams;
      setUseLegacy(legacyFlagFromEnv() || legacyFlagFromQuery(params));
    } catch {}
  }, []);
  return (
    <>
      <Head><title>Log In · QuickGig</title></Head>
      {useLegacy && legacyHtml ? (
        <main dangerouslySetInnerHTML={{ __html: legacyHtml }} />
      ) : (
        <main style={{ padding: 24, fontFamily: 'ui-sans-serif,system-ui' }}>
          <h1>Log In</h1>
          <p>Turn on legacy via <code>NEXT_PUBLIC_LEGACY_UI=true</code> or
            <a href="/login?legacy=1">/login?legacy=1</a>.
          </p>
        </main>
      )}
    </>
  );
}
