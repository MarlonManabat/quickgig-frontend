# Smoke Tests

## Run all smokes locally
```bash
npx playwright test -c playwright.smoke.ts
```

## Run a specific spec

```bash
npx playwright test -c playwright.smoke.ts tests/smoke/post-job-form-render.spec.ts
```

## Rules (important)

* **Selectors**: Smokes target header CTAs via `data-testid`:

  * `nav-browse-jobs`, `nav-post-job`, `nav-my-applications`, `nav-login`
  * Hero CTAs use `hero-*` and are for landing-only tests.
* **Auth-aware**: For auth-gated pages, treat either the destination **or** `/login?next=…` as passing. Use `expectAuthAwareSuccess(page, /<dest-path>$/)`.
* **Post Job form**: The smoke test passes if the form renders, the `post-job-skeleton` renders, or the request is redirected to login.
