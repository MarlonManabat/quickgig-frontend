import * as React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { legacyEnabled } from '../lib/legacyClient';

export default function Home({ fragment = '' }: { fragment?: string }) {
  const [legacy, setLegacy] = React.useState(false);
  React.useEffect(() => setLegacy(legacyEnabled()), []);
  return (
    <>
      <Head>
        <title>QuickGig</title>
      </Head>
      {legacy ? (
        // Legacy marketing shell: server serves fragments & styles from /public/legacy/**
        <main
          dangerouslySetInnerHTML={{
            __html: `
          <link rel="preload" as="font" href="/legacy/fonts/LegacySans.woff2" type="font/woff2" crossorigin>
          <link rel="stylesheet" href="/legacy/styles.css">
          ${fragment}
        `,
          }}
        />
      ) : (
        <main style={{ padding: 24, fontFamily: 'ui-sans-serif,system-ui' }}>
          <h1>QuickGig</h1>
          <p>
            Set <code>NEXT_PUBLIC_LEGACY_UI=true</code> or visit{' '}
            <Link href="/?legacy=1">/?legacy=1</Link> to render the legacy shell.
          </p>
        </main>
      )}
    </>
  );
}

export async function getStaticProps() {
  const fs = await import('fs');
  const fragment = fs.readFileSync('public/legacy/index.fragment.html', 'utf8');
  return { props: { fragment } };
}
