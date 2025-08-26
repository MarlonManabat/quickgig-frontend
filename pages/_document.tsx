import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  let preconnectHref: string | null = null;
  try {
    if (supabaseUrl) preconnectHref = new URL(supabaseUrl).origin;
  } catch {}
  return (
    <Html lang="en">
      <Head>
        {preconnectHref && (
          <>
            <link rel="preconnect" href={preconnectHref} crossOrigin="" />
            <link rel="dns-prefetch" href={preconnectHref} />
          </>
        )}
        <meta name="theme-color" content="#000000" />
        <meta name="color-scheme" content="light only" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
