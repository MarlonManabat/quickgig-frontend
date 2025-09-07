<!-- AGENT CONTRACT v2025-12-13 -->

## 2025-09-07
- Header CTAs canonicalized; friendly auth errors; non-blank 404/500; link-audit script.

## 2025-09-06
- Auth-aware redirects in CI: unauthenticated CTA clicks redirect to `/login?next=<path>`.
- Header nav testids used by smoke: `nav-browse-jobs`, `nav-post-job`, `nav-my-applications`, `nav-login`.
- Mobile menu button testid: `nav-menu-button` (open menu before asserting mobile links).
- Sitemap expectations: include `/browse-jobs` on the main host; also allow/expect base entries for `https://quickgig.ph/` and `https://app.quickgig.ph/`.
- Helpers referenced by tests: `expectAuthAwareRedirect(page, dest, timeout=8000)`.


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
- CTAs include `data-cta` matching their test ID
- Unauth flows: redirect to **/login?next=<dest>** counts as success
- No white screens (page-level error/skeleton boundaries in gated flows)
- Header CTA testids: `nav-browse-jobs`, `nav-post-job`, `nav-my-applications`, `nav-menu-button`
- Hero CTA testids: `hero-browse-jobs`, `hero-post-job`
- Canonical routes: `/browse-jobs`, `/post-job`, `/applications`
- Auth-aware: unauthenticated clicks on gated CTAs may redirect to `/login?next=<dest>`.

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
- **/post-job**  (Post Job)
- **/applications**
- **/login**

## CTA Test IDs
**Header (desktop):** `nav-browse-jobs`, `nav-post-job`, `nav-my-applications`, `nav-tickets`, `nav-login`
**Mobile menu button:** `nav-menu-button`
**Mobile menu container:** `nav-menu`
**Mobile menu items:** `navm-browse-jobs`, `navm-post-job`, `navm-my-applications`, `navm-tickets`, `navm-login`
**Landing hero:** `hero-browse-jobs`, `hero-post-job`
**Applications empty CTA:** `browse-jobs-from-empty`

**No duplicates:** each CTA test ID must appear at most once in the DOM.

## Page Test IDs
- Browse list: `jobs-list`, `job-card`
- Job detail: `apply-button`
- Applications: `applications-list`, `application-row`, `applications-empty`

## Unauth Success Rule
Landing on **/login?next=<dest>** for any auth-gated route **counts as success** in tests.
- Clicking **Apply** while signed out should redirect to `/login?next=/applications`.

## PR Acceptance Checklist
- [ ] `bash scripts/no-legacy.sh`
- [ ] `node scripts/check-cta-links.mjs`
- [ ] `npx playwright test -c playwright.smoke.ts`
- [ ] `docs/backfill.md` updated with rationale
- [ ] Bump this header’s date when any contract item changes
- [ ] Mobile menu panel renders only when open; `data-testid="nav-menu"` matches the visible container

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
