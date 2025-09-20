# agents.md

## Contract
- Keep “Good Product” flows green:
  1. `/` → `/browse-jobs` (non-empty list or friendly empty state)
  2. Job details Apply CTA redirects unauthenticated users to `/api/auth/pkce/start?next=` or `/login?next=` and records the click
  3. `/applications` unauthenticated access redirects using the same rule
  4. Employers can post a gig at `/gigs/create`; on success the gig shows up in Browse Jobs

## Canonical selectors
`nav-browse-jobs`, `nav-login`, `nav-my-applications`, `nav-post-job`, `nav-menu-button`, `nav-menu`,
`jobs-list`, `job-card`, `filter-region`, `filter-city`,
`apply-button`, `applications-list`, `applications-empty`, `post-job-skeleton`

## CI rules
- Pull Requests must pass `pnpm lint`, `pnpm typecheck`, `pnpm build`, and `pnpm test:smoke`
- Full E2E (`pnpm test:e2e`) runs only via the manual GitHub workflow
