import Head from 'next/head';
interface Props { title: string; description?: string; }
export default function HeadSEO({ title, description }: Props) {
  return (
    <Head>
      <title>{title}</title>
      {description ? <meta name="description" content={description} /> : null}
    </Head>
  );
}
