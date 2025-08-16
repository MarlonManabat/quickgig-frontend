export const runtime = 'nodejs';

import LegacyLogin from '@/app/login/LegacyLogin';
import { loadFragment, sanitizeLegacyHtml } from '@/lib/legacyFragments';

type Props = {
  fragment: 'index' | 'login';
  nextUrl?: string;
};

export default function LegacyShell({ fragment, nextUrl }: Props) {
  const header = loadFragment('header');
  const footer = loadFragment('footer');
  const main = loadFragment(fragment);
  const bannerRaw = process.env.NEXT_PUBLIC_BANNER_HTML;
  const banner = bannerRaw ? sanitizeLegacyHtml(bannerRaw) : '';

  return (
    <>
      <link rel="stylesheet" href="/legacy/styles.css" />
      <div className="min-h-screen flex flex-col">
        {header && (
          <header
            className="sticky top-0 z-50"
            dangerouslySetInnerHTML={{ __html: header }}
          />
        )}
        {banner && <div dangerouslySetInnerHTML={{ __html: banner }} />}
        <main className="flex-1 overflow-x-hidden">
          {fragment === 'login' ? (
            <LegacyLogin html={main} nextUrl={nextUrl} />
          ) : (
            <div dangerouslySetInnerHTML={{ __html: main }} />
          )}
        </main>
        {footer && <footer dangerouslySetInnerHTML={{ __html: footer }} />}
      </div>
    </>
  );
}

