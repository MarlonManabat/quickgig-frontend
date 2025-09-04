<!-- AGENT CONTRACT v2025-09-04 -->

# Product Acceptance (Good Product Bar)

**Mobile (seeker)**
- Open → **/browse-jobs** (non-empty)
- Open a job → **Apply**
- Application appears in **/applications** (“My Applications”)

**Employer**
- **Post a job** → Job appears in **/browse-jobs**

**No dead ends**
- Root “/” **must** 302/308 → **/browse-jobs**
- CTAs use canonical routes (no raw hrefs, no legacy paths)
- Unauth flows: redirect to **/login?next=<dest>** counts as success
- No white screens (page-level error/skeleton boundaries in gated flows)

**Observability**
- Sentry enabled (frontend DSN)
- Basic analytics events for CTA clicks + apply/post
- Tiny admin affordance to unpublish spam

**CI green by design**
- Smoke/e2e cover the above paths
- CI guardrails forbid legacy anchors/paths and require stable CTA test IDs

---

## Canonical Routes
- **/browse-jobs**
- **/gigs/create**  (Post Job)
- **/applications**
- **/login**

## CTA Test IDs
**Header (desktop):** `nav-browse-jobs`, `nav-post-job`, `nav-my-applications`, `nav-login`  
**Header (mobile menu):** `navm-browse-jobs`, `navm-post-job`, `navm-my-applications`, `navm-login`  
**Landing hero:** `hero-browse-jobs`, `hero-post-job`

## Unauth Success Rule
Landing on **/login?next=<dest>** for any auth-gated route **counts as success** in tests.

## PR Acceptance Checklist
- [ ] `npm run no-legacy` (no legacy anchors/paths)
- [ ] `node scripts/check-cta-links.mjs` (CTAs point to canonical routes)
- [ ] `npx playwright test -c playwright.smoke.ts`
- [ ] `docs/backfill.md` updated with rationale + changes
- [ ] Bump this header’s date when any contract item changes

## CI Guardrails
- `scripts/no-legacy.sh` and `scripts/check-cta-links.mjs`
- Agents contract verifier (checks this header + sections)
## PR Smoke Guardrails (read me first)
- Do **not** use `cta-post-job` / `cta-my-applications` testIds. Use `nav-post-job` / `nav-my-applications`.
- For auth-gated routes, accept `/login?next=…` as valid using `expectAuthAwareRedirect`.
- Ensure `post-job-skeleton` remains available for client-side checks.
- Before opening a PR, run:
  ```bash
  npm run no-legacy
  ```
