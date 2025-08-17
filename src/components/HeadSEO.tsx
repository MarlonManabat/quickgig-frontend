import Head from 'next/head';
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
  const finalTitle = titleKey ? t(titleKey) : (title || '');
  const finalDesc = descKey ? t(descKey) : description;
  return (
    <Head>
      <title>{finalTitle}</title>
      <meta name="description" content={finalDesc} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDesc} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={image} />
      {canonical ? <link rel="canonical" href={canonical} /> : null}
      {noIndex ? <meta name="robots" content="noindex" /> : null}
      <meta name="twitter:card" content="summary_large_image" />
    </Head>
  );
}
