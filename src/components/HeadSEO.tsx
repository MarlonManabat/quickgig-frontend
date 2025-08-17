import Head from 'next/head';

export function HeadSEO({
  title,
  description = 'Browse flexible gigs in the Philippines and apply in minutes.',
  image = '/legacy/img/og.jpg',
  canonical = '',
}: {
  title: string;
  description?: string;
  image?: string;
  canonical?: string;
}) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={image} />
      {canonical ? <link rel="canonical" href={canonical} /> : null}
      <meta name="twitter:card" content="summary_large_image" />
    </Head>
  );
}
