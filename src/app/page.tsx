import { readLegacyFragment, legacyCssHref } from '@/lib/legacy';
import { parseFragment } from '@/lib/legacy/html';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function MarketingHome() {
  const css = await legacyCssHref();
  const html = await readLegacyFragment('index.fragment.html');

  // If we have a fragment, render it; otherwise show the existing React hero as fallback.
  if (html) {
    const $ = parseFragment(html);
    return (
      <html>
        <head>
          {css ? <link rel="stylesheet" href={css} /> : null}
          <meta name="robots" content="index,follow" />
        </head>
        <body dangerouslySetInnerHTML={{ __html: $.html() }} />
      </html>
    );
  }

  // Fallback: current React-based home (keeps site usable if legacy files are missing)
  return (
    <main className="px-4 py-12">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-4xl font-bold">QuickGig</h1>
        <p className="mt-4 text-lg">Gigs and talent, matched fast.</p>
      </div>
    </main>
  );
}
