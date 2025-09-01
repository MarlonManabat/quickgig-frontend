# Product-first notes

- [DB policies to apply in Supabase](./rls.sql)
- Preview builds degrade gracefully when Supabase secrets are absent. API routes and pages return safe placeholders instead of throwing, so product development can continue.

## Filters & pagination
The gigs list page reads query parameters for search and paging. When Supabase secrets are absent, the API falls back to a local mock so previews still show sample gigs.

## Gig detail + apply
The gig detail page and applications API also fall back to in-memory mocks when
Supabase secrets are missing. Preview builds can browse sample gig details and
"apply" without hitting a real database. To use real data, provide Supabase
credentials and swap the mock helpers with actual `gigs` and `applications`
tables.

## Post a gig

The `/gigs/create` page and its `/api/gigs/create` endpoint are dynamic and do
not require Supabase secrets. In previews without secrets, gig creation uses an
in-memory mock store so the flow still works.

## Applications dashboard

`/applications` is dynamic (no SSG) to avoid preview build failures. It falls
back to mock data when secrets are absent; replace by real DB later.
Workers can withdraw an application. In previews, the endpoint mutates mock memory state; replace with real DB later.

## Employer dashboard

The `/owner/gigs` pages and APIs are dynamic and fall back to in-memory mocks
when Supabase secrets are absent. Preview builds can list gigs, view applicants,
and update statuses without hitting the database.

## Candidate dashboard
`/me/applications` lists a worker's gig applications. It is dynamic (no SSG) and uses mock data when Supabase secrets are absent or policies block reads.

## Withdraw API
`POST /api/applications/:id/withdraw` sets an application's status to `withdrawn`. When Supabase write access is missing, the endpoint responds with a stubbed 200 and an echo payload so flows still work in Preview.

## Ops & UX scaffolding
- Health endpoints `/api/health` and `/api/status` expose basic runtime info without secrets.
- Dynamic pages use `loading.tsx` skeletons to mask latency while fetching.
- `robots.txt` and `sitemap.xml` serve canonical URLs and fall back to minimal entries if Supabase is unavailable.
