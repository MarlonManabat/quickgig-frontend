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

* **Selectors**: Smokes must target **header CTAs only** via stable IDs:

  * `data-testid="nav-post-job"`, `data-testid="nav-my-applications"`
  * Hero CTAs use `hero-*` and are for landing-only tests, not smokes.
* **Auth-aware**: For auth-gated pages, treat any of the destination, `/login?next=…`, or `/browse-jobs` (Good Product gate) as passing. Use `expectAuthAwareOutcome(page, '<dest-path>')`.
* **Post Job form**: The smoke test passes if the form renders, the `post-job-skeleton` renders, or the request is redirected to login.
