import { readLegacyFragment, legacyCssHref } from '@/lib/legacy';
import { parseFragment } from '@/lib/legacy/html';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function LoginPage() {
  const css = await legacyCssHref();
  const html = await readLegacyFragment('login.fragment.html');

  if (html) {
    const $ = parseFragment(html);
    return (
      <html>
        <head>{css ? <link rel="stylesheet" href={css} /> : null}</head>
        <body dangerouslySetInnerHTML={{ __html: $.html() }} />
      </html>
    );
  }

  // Fallback to React login that posts to same-origin /api/session/login
  return (
    <form method="POST" action="/api/session/login" className="mx-auto mt-12 max-w-md space-y-4 p-6">
      <input name="email" type="email" required className="w-full rounded border p-2" placeholder="Email" />
      <input name="password" type="password" required className="w-full rounded border p-2" placeholder="Password" />
      <button className="w-full rounded bg-yellow-400 p-2 font-semibold">Login</button>
    </form>
  );
}
