# Product-first notes

- [DB policies to apply in Supabase](./rls.sql)
- Preview builds degrade gracefully when Supabase secrets are absent. API routes and pages return safe placeholders instead of throwing, so product development can continue.

## Filters & pagination
The gigs list page reads query parameters for search and paging. When Supabase secrets are absent, the API falls back to a local mock so previews still show sample gigs.
