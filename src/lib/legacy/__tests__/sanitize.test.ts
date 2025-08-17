import assert from 'node:assert/strict';
import test from 'node:test';
import { sanitizeLegacyHtml, renderLegacyHome } from '../renderLegacy';

test('removes scripts and handlers', () => {
  const input = `
    <div onclick="alert('x')">
      <img src="/img/a.png" />
      <img src="img/b.png" />
      <link href="/fonts/a.woff" />
      <link href="fonts/b.woff" />
      <script>alert('hi')</script>
    </div>
  `;
  const out = sanitizeLegacyHtml(input);
  assert(!out.includes('<script'));
  assert(!out.includes('onclick'));
  assert(out.includes('src="/legacy/img/a.png"'));
  assert(out.includes('src="/legacy/img/b.png"'));
  assert(out.includes('href="/legacy/fonts/a.woff"'));
  assert(out.includes('href="/legacy/fonts/b.woff"'));
});

test('banner HTML is sanitized', async () => {
  process.env.NEXT_PUBLIC_BANNER_HTML = '<div onclick="evil()"><script>alert(1)</script><span>Hi</span></div>';
  const out = await renderLegacyHome();
  assert(out.includes('<span>Hi</span>'));
  assert(!out.includes('onclick'));
  assert(!out.includes('<script'));
  delete process.env.NEXT_PUBLIC_BANNER_HTML;
});

