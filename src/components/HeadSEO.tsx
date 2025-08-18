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
  const finalTitle = titleKey ? t(titleKey) : title || '';
  const finalDesc = descKey ? t(descKey) : description;
  const router = useRouter();
  const host = process.env.NEXT_PUBLIC_CANONICAL_HOST || '';
  const path = (canonical || router.asPath || '/').split('?')[0];
  const canonicalUrl = host ? `${host}${path.startsWith('/') ? path : `/${path}`}` : '';
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
      {noIndex ? <meta name="robots" content="noindex" /> : null}
      {enablePwa && <link rel="manifest" href="/site.webmanifest" />}
      {enablePwa && <meta name="theme-color" content="#ffffff" />}
      <meta name="twitter:card" content="summary_large_image" />
    </Head>
  );
}
