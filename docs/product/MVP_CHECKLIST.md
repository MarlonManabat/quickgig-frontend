# MVP Checklist (living)
## Core ✅
- [x] PSGC static locations via `@jobuntux/psgc` + GeoSelect
- [x] Canonical routes: /gigs/create, /gigs (Landing CTAs unified)
- [x] Applications thread: no spinner, polling, optimistic send
- [x] Tickets gate + atomic deduct on create
- [x] Tickets page: GCash upload, polling, auto-redirect
- [x] Safe `next` redirects; header ticket badge+link
- [x] RSC guard (no hooks in server components)

## Ops ✅
- [x] PR title guard (non-blocking)
- [x] Vercel ignoreCommand to skip docs/CI-only deploys

## Release prep 🟡
- [ ] PRD pass of copy (Landing, Post Job, Tickets)
- [ ] Admin path: approve proof → credit ticket confirmed in prod
- [ ] Seed: ensure `user_tickets` row exists on signup/login if missing
- [ ] Manual smoke run (see workflow) before “Go Live”
