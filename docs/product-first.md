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

## Applications dashboard

`/applications` is dynamic (no SSG) to avoid preview build failures. It falls
back to mock data when secrets are absent; replace by real DB later.
