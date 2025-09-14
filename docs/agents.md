<!-- AGENT CONTRACT v2025-12-16 -->

## 2025-12-14
- Added signup/logout routes, hero-start CTA, and per-route error/loading.

## 2025-12-15
- Documented CTA contract and logout endpoint.

## 2025-09-07
- Header CTAs canonicalized; friendly auth errors; non-blank 404/500; link-audit script.

## 2025-09-06
- Auth-aware redirects in CI: unauthenticated CTA clicks redirect to `/login?next=<path>`.
- Header nav testids used by smoke: `nav-browse-jobs`, `nav-post-job`, `nav-my-applications`, `nav-tickets`, `nav-login` (desktop)
- Nav links reuse the same IDs on all viewports (no `-menu` suffix).
- Sitemap expectations: include `/browse-jobs` on the main host; also allow/expect base entries for `https://quickgig.ph/` and `https://app.quickgig.ph/`.
- Helpers referenced by tests: `expectAuthAwareRedirect(page, dest, timeout=8000)`.


# Product Acceptance (Good Product Bar)

**Mobile (seeker)**
- Open → **/browse-jobs** (non-empty)
- Open a job → **Apply**
- Application appears in **/applications** (“My Applications”)

**Employer**
- **Post a job** → Job appears in **/browse-jobs**

- Root “/” shows landing in CI/preview; production may 302 → **/browse-jobs** when `NEXT_PUBLIC_REDIRECT_HOME_TO_BROWSE=1`
- CTAs use canonical routes (no raw hrefs, no legacy paths)
- CTAs include `data-cta` matching their test ID
- Unauth flows: redirect to **/login?next=<dest>** counts as success
- No white screens (page-level error/skeleton boundaries in gated flows)
- Header CTA testids: `nav-browse-jobs`, `nav-post-job`, `nav-my-applications`, `nav-tickets`, `nav-login`
- Hero CTA testids: `hero-start`, `hero-post`, `hero-signup`
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
**Header:** `nav-browse-jobs`, `nav-post-job`, `nav-my-applications`, `nav-tickets`, `nav-login`
**Landing hero:** `hero-start`, `hero-post`, `hero-signup`
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
- [ ] `node scripts/audit-links.mjs`
- [ ] `npx playwright test -c playwright.smoke.ts`
- [ ] `docs/backfill.md` updated with rationale
- [ ] Bump this header’s date when any contract item changes

## CI Guardrails
- `scripts/no-legacy.sh` and `scripts/audit-links.mjs`
- Agents contract verifier (checks this header + sections)
## PR Smoke Guardrails (read me first)
- Do **not** use `cta-post-job` / `cta-my-applications` testIds. Use `nav-post-job` / `nav-my-applications`.
- For auth-gated routes, accept `/login?next=…` as valid using `expectAuthAwareRedirect`.
- Ensure `post-job-skeleton` remains available for client-side checks.
- Before opening a PR, run:
  ```bash
  npm run no-legacy
  ```
