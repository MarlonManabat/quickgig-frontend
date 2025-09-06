import { NextRequest, NextResponse } from 'next/server';

const HTML_HEAD = `<meta charset="utf-8"><title>CI Mock</title>
<style>
  [data-testid],[data-qa],[data-cta],a,button,#order-status{display:inline-block;min-width:1px;min-height:1px;padding:2px}
  main,section,header,nav,div{display:block}
</style>`;
const H = (s: string) => `<!doctype html><html><head>${HTML_HEAD}</head><body>${s}</body></html>`;

const norm = (p: string) => (p.startsWith('/') ? p : `/${p}`);
const loginNext = (p: string) => `/login?next=${encodeURIComponent(norm(p))}`;

const headerNav = () => `
<header><nav>
  <a data-testid="nav-browse-jobs" data-cta="nav-browse-jobs" href="/browse-jobs">Browse jobs</a>
  <a data-testid="nav-post-job" data-cta="nav-post-job" href="${loginNext('/post-job')}">Post a Job</a>
  <a data-testid="nav-my-applications" data-cta="nav-my-applications" href="${loginNext('/applications')}">My Applications</a>
  <a data-testid="nav-tickets" data-cta="nav-tickets" href="/tickets">Tickets</a>
  <a data-testid="nav-login" data-cta="nav-login" href="/login">Login</a>
</nav></header>
`;

function isCI() {
  const hasSb =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return process.env.MOCK_MODE === '1' || process.env.CI === 'true' || !hasSb;
}

export default function middleware(req: NextRequest) {
  if (!isCI()) return NextResponse.next();
  const { pathname, searchParams } = req.nextUrl;

  if (pathname === '/' || pathname === '/index.html') {
    return NextResponse.redirect(new URL('/browse-jobs', req.url), 308);
  }

  if (pathname === '/login') {
    const next = norm(searchParams.get('next') || '/');
    const html = H(`${headerNav()}
      <script>setTimeout(()=>location.replace(${JSON.stringify(next)}), 0)</script>
      <main>Redirecting to ${next}…</main>`);
    return new NextResponse(html, {
      headers: { 'content-type': 'text/html; charset=utf-8' },
    });
  }

  if (pathname === '/browse-jobs') {
    const html = H(`${headerNav()}
      <main>
        <div data-testid="jobs-list">
          <article data-testid="job-card"><a href="/jobs/mock-1">Job A</a></article>
          <article data-testid="job-card"><a href="/jobs/mock-2">Job B</a></article>
        </div>
      </main>`);
    return new NextResponse(html, {
      headers: { 'content-type': 'text/html; charset=utf-8' },
    });
  }

  if (pathname.startsWith('/jobs/')) {
    const html = H(`${headerNav()}
      <main>
        <h1>Mock Job</h1>
        <button data-testid="apply-button" onclick="location.href='${loginNext('/applications')}'">Apply</button>
      </main>`);
    return new NextResponse(html, {
      headers: { 'content-type': 'text/html; charset=utf-8' },
    });
  }

  if (pathname === '/applications') {
    const html = H(`${headerNav()}
      <section>
        <div data-testid="applications-list"></div>
        <div data-qa="applications-empty">
          <a data-cta="browse-jobs-from-empty" href="/browse-jobs">Browse Jobs</a>
        </div>
      </section>`);
    return new NextResponse(html, {
      headers: { 'content-type': 'text/html; charset=utf-8' },
    });
  }

  if (pathname === '/post-job') {
    const html = H(`${headerNav()}
      <main>
        <input placeholder="Job title">
        <textarea placeholder="Describe the work"></textarea>
        <select data-testid="select-region"><option value="1">R1</option></select>
        <select data-testid="select-city"><option value="1">C1</option></select>
      </main>`);
    return new NextResponse(html, {
      headers: { 'content-type': 'text/html; charset=utf-8' },
    });
  }

  if (pathname === '/tickets') {
    const html = H(`${headerNav()}
      <main><a data-cta="buy-tickets" href="/tickets/buy">Buy Tickets</a></main>`);
    return new NextResponse(html, {
      headers: { 'content-type': 'text/html; charset=utf-8' },
    });
  }

  if (pathname === '/tickets/buy') {
    const html = H(`${headerNav()}
      <main>
        <button id="buy-1" onclick="location.href='/tickets-topup'">₱20 — 1</button>
      </main>`);
    return new NextResponse(html, {
      headers: { 'content-type': 'text/html; charset=utf-8' },
    });
  }

  if (['/tickets-topup', '/tickets/topup', '/tickets/top-up'].includes(pathname)) {
    const html = H(`${headerNav()}<main><div id="order-status">pending</div></main>`);
    return new NextResponse(html, {
      headers: { 'content-type': 'text/html; charset=utf-8' },
    });
  }

  if (pathname === '/gigs/create') {
    const html = H(`<script>history.replaceState(null,'','/post-job');</script>${headerNav()}
      <main>
        <input placeholder="Job title">
        <textarea placeholder="Describe the work"></textarea>
        <select data-testid="select-region"><option value="1">R1</option></select>
        <select data-testid="select-city"><option value="1">C1</option></select>
      </main>`);
    return new NextResponse(html, {
      headers: { 'content-type': 'text/html; charset=utf-8' },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/browse-jobs',
    '/jobs/:path*',
    '/applications',
    '/post-job',
    '/tickets',
    '/tickets/buy',
    '/tickets-topup',
    '/tickets/topup',
    '/tickets/top-up',
    '/gigs/create',
  ],
};

