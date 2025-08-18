import Head from 'next/head';
import { useRouter } from 'next/router';
import { t } from '../lib/t';

export function HeadSEO({
  title,
  titleKey,
  description = 'Browse flexible gigs in the Philippines and apply in minutes.',
  descKey,
  image = '/legacy/img/og.jpg',
  canonical = '',
  noIndex = false,
}: {
  title?: string;
  titleKey?: Parameters<typeof t>[0];
  description?: string;
  descKey?: Parameters<typeof t>[0];
  image?: string;
  canonical?: string;
  noIndex?: boolean;
}) {
  const router = useRouter();
  const host = process.env.NEXT_PUBLIC_CANONICAL_HOST || '';
  const path = canonical || (router?.asPath?.split('?')[0] || '');
  const canonicalUrl = host && path ? `${host}${path.startsWith('/') ? path : `/${path}`}` : '';
  const envNoIndex = process.env.NEXT_PUBLIC_NOINDEX === 'true';
  const finalTitle = titleKey ? t(titleKey) : title || '';
  const finalDesc = descKey ? t(descKey) : description;
  const finalNoIndex = envNoIndex || noIndex;
  const enablePwa = process.env.NEXT_PUBLIC_ENABLE_PWA === 'true';
  return (
    <Head>
      <title>{finalTitle}</title>
      <meta name="description" content={finalDesc} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDesc} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={image} />
      {canonicalUrl ? <link rel="canonical" href={canonicalUrl} /> : null}
      {finalNoIndex ? <meta name="robots" content="noindex, nofollow" /> : null}
      {enablePwa ? (
        <>
          <link rel="manifest" href="/manifest.json" />
          <meta name="theme-color" content="#0b2a32" />
        </>
      ) : null}
      <meta name="twitter:card" content="summary_large_image" />
    </Head>
  );
}
