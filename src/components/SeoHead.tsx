import Head from 'next/head';
import { SEO } from '@/config/seo';

interface Props {
  title?: string;
  description?: string;
}

export default function SeoHead({ title, description }: Props) {
  const metaTitle = title ? `${title} | ${SEO.siteName}` : SEO.defaultTitle;
  const metaDesc = description || SEO.defaultDescription;
  const ogImage = SEO.openGraph.images[0]?.url;
  return (
    <Head>
      <title>{metaTitle}</title>
      <meta name="description" content={metaDesc} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:site_name" content={SEO.siteName} />
      <meta property="og:image" content={ogImage} />
      <meta name="twitter:card" content={SEO.twitter.card} />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDesc} />
      {SEO.twitter.creator && (
        <meta name="twitter:creator" content={SEO.twitter.creator} />
      )}
      {SEO.twitter.images?.[0] && (
        <meta name="twitter:image" content={SEO.twitter.images[0]} />
      )}
    </Head>
  );
}
