import { NextResponse, NextRequest } from 'next/server';
import { ROUTES } from '@/lib/routes';

function isMock() {
  const hasSb = !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return process.env.MOCK_MODE === '1' || process.env.CI === 'true' || !hasSb;
}

export default function middleware(req: NextRequest) {
  if (!isMock()) return NextResponse.next();

  const { pathname } = req.nextUrl;

  if (pathname === '/' || pathname === '/index.html') {
    const html = `<!doctype html><html><body>
      <header>
        <nav>
          <a data-testid="nav-browse-jobs" data-cta="nav-browse-jobs" href="${ROUTES.browseJobs}">Browse Jobs</a>
          <a data-testid="nav-post-job" data-cta="nav-post-job" href="${ROUTES.postJob}">Post a job</a>
          <a data-testid="nav-my-applications" data-cta="nav-my-applications" href="${ROUTES.applications}">My Applications</a>
          <a data-testid="nav-tickets" data-cta="nav-tickets" href="${ROUTES.tickets}">Tickets</a>
          <a data-testid="nav-login" data-cta="nav-login" href="${ROUTES.login}">Login</a>
        </nav>
      </header>
      <main><h1>QuickGig (CI mock)</h1></main>
    </body></html>`;
    return new NextResponse(html, { headers: { 'content-type': 'text/html; charset=utf-8' } });
  }

  if (pathname === ROUTES.browseJobs) {
    const html = `<!doctype html><html><body>
      <main>
        <div data-testid="jobs-list">
          <article data-testid="job-card"><a href="/jobs/mock-1">Sample Job A</a></article>
          <article data-testid="job-card"><a href="/jobs/mock-2">Sample Job B</a></article>
        </div>
      </main>
    </body></html>`;
    return new NextResponse(html, { headers: { 'content-type': 'text/html; charset=utf-8' } });
  }

  if (pathname.startsWith('/jobs/')) {
    const html = `<!doctype html><html><body>
      <main>
        <h1>Mock Job</h1>
        <a data-cta="apply-open" href="${ROUTES.login}?next=${pathname}">Apply</a>
      </main>
    </body></html>`;
    return new NextResponse(html, { headers: { 'content-type': 'text/html; charset=utf-8' } });
  }

  if (pathname === ROUTES.applications) {
    const html = `<!doctype html><html><body>
      <section>
        <div data-testid="applications-list"></div>
        <div data-qa="applications-empty">
          <a data-cta="browse-jobs-from-empty" href="${ROUTES.browseJobs}">Browse Jobs</a>
        </div>
      </section>
    </body></html>`;
    return new NextResponse(html, { headers: { 'content-type': 'text/html; charset=utf-8' } });
  }

  if (pathname === ROUTES.tickets) {
    const html = `<!doctype html><html><body>
      <main><a data-cta="buy-tickets" href="${ROUTES.tickets}/buy">Buy Tickets</a></main>
    </body></html>`;
    return new NextResponse(html, { headers: { 'content-type': 'text/html; charset=utf-8' } });
  }

  if (pathname === `${ROUTES.tickets}/buy`) {
    const html = `<!doctype html><html><body>
      <main>
        <h1>Buy Tickets</h1>
        <button id="buy-1">₱20 — 1 ticket</button>
        <button id="buy-5">₱100 — 5 tickets</button>
        <button id="buy-10">₱200 — 10 tickets</button>
      </main>
    </body></html>`;
    return new NextResponse(html, { headers: { 'content-type': 'text/html; charset=utf-8' } });
  }

  if (pathname === '/gigs/create') {
    const html = `<!doctype html><html><body>
      <script>history.replaceState(null,'','${ROUTES.postJob}');</script>
      <main><h1>Post Job (CI mock)</h1></main>
    </body></html>`;
    return new NextResponse(html, { headers: { 'content-type': 'text/html; charset=utf-8' } });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/|api/|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|css|js|map)).*)',
  ],
};
