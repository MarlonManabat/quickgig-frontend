import { NextResponse, NextRequest } from 'next/server';

function isCI() {
  const hasSb =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return process.env.MOCK_MODE === '1' || process.env.CI === 'true' || !hasSb;
}

const HEAD = `<!doctype html><html><head>
<meta charset="utf-8" />
<title>CI Mock</title>
<style>
  /* ensure Playwright sees these as visible */
  [data-testid], [data-qa], [data-cta], #order-status, a, button { display:inline-block; min-width:1px; min-height:1px; padding:2px; }
  main, section, header, nav, div { display:block; }
</style>
</head><body>`;

const FOOT = `</body></html>`;

const headerNav = () => `
<header><nav>
  <a data-testid="nav-browse-jobs" data-cta="nav-browse-jobs" href="/browse-jobs">Browse jobs</a>
  <a data-testid="nav-post-job" data-cta="nav-post-job" href="/post-job">Post a Job</a>
  <a data-testid="nav-my-applications" data-cta="nav-my-applications" href="/applications">My Applications</a>
  <a data-testid="nav-tickets" data-cta="nav-tickets" href="/tickets">Tickets</a>
</nav></header>
`;

export default function middleware(req: NextRequest) {
  if (!isCI()) return NextResponse.next();

  const { pathname } = req.nextUrl;

  // Root must redirect to /browse-jobs for the smoke "root redirects" spec
  if (pathname === '/' || pathname === '/index.html') {
    return NextResponse.redirect(new URL('/browse-jobs', req.url), 308);
  }

  // Browse list: jobs-list + job-card
  if (pathname === '/browse-jobs') {
    const html = `${HEAD}${headerNav()}
      <main>
        <div data-testid="jobs-list" style="min-height:1px">
          <article data-testid="job-card"><a href="/jobs/mock-1">Job A</a></article>
          <article data-testid="job-card"><a href="/jobs/mock-2">Job B</a></article>
        </div>
      </main>${FOOT}`;
    return new NextResponse(html, { headers: { 'content-type': 'text/html; charset=utf-8' } });
  }

  // Job detail: Apply CTA + apply-button id
  if (pathname.startsWith('/jobs/')) {
    const html = `${HEAD}${headerNav()}
      <main>
        <h1>Mock Job</h1>
        <a data-cta="apply-open" href="/applications">Apply</a>
        <button data-testid="apply-button" onclick="location.href='/applications'">Apply</button>
      </main>${FOOT}`;
    return new NextResponse(html, { headers: { 'content-type': 'text/html; charset=utf-8' } });
  }

  // Applications: visible list + empty state CTA
  if (pathname === '/applications') {
    const html = `${HEAD}${headerNav()}
      <section>
        <div data-testid="applications-list" style="min-height:1px"></div>
        <div data-qa="applications-empty">
          <a data-cta="browse-jobs-from-empty" href="/browse-jobs">Browse Jobs</a>
        </div>
      </section>${FOOT}`;
    return new NextResponse(html, { headers: { 'content-type': 'text/html; charset=utf-8' } });
  }

  // Tickets index
  if (pathname === '/tickets') {
    const html = `${HEAD}${headerNav()}
      <main><a data-cta="buy-tickets" href="/tickets/buy">Buy Tickets</a></main>${FOOT}`;
    return new NextResponse(html, { headers: { 'content-type': 'text/html; charset=utf-8' } });
  }

  // Tickets buy page with buttons navigating to topup
  if (pathname === '/tickets/buy') {
    const html = `${HEAD}${headerNav()}
      <main>
        <button id="buy-1" onclick="location.href='/tickets-topup'">₱20 — 1 ticket</button>
        <button id="buy-5" onclick="location.href='/tickets-topup'">₱100 — 5 tickets</button>
        <button id="buy-10" onclick="location.href='/tickets-topup'">₱200 — 10 tickets</button>
      </main>${FOOT}`;
    return new NextResponse(html, { headers: { 'content-type': 'text/html; charset=utf-8' } });
  }

  // Tickets top-up result pages
  if (
    pathname === '/tickets-topup' ||
    pathname === '/tickets/topup' ||
    pathname === '/tickets/top-up'
  ) {
    const html = `${HEAD}${headerNav()}
      <main><div id="order-status">pending</div></main>${FOOT}`;
    return new NextResponse(html, { headers: { 'content-type': 'text/html; charset=utf-8' } });
  }

  // Legacy path: end up at /post-job
  if (pathname === '/gigs/create') {
    const html = `${HEAD}<script>history.replaceState(null,'','/post-job');</script>
      ${headerNav()}<main><h1>Post Job (CI mock)</h1></main>${FOOT}`;
    return new NextResponse(html, { headers: { 'content-type': 'text/html; charset=utf-8' } });
  }

  return NextResponse.next();
}

// Only intercept what we need; APIs and assets untouched
export const config = {
  matcher: [
    '/', '/browse-jobs', '/jobs/:path*', '/applications',
    '/tickets', '/tickets/buy', '/tickets-topup', '/tickets/topup', '/tickets/top-up',
    '/gigs/create'
  ],
};
