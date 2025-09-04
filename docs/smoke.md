# Smoke Tests

Run all smoke tests locally:

```bash
npx playwright test -c playwright.smoke.ts
```

Run a specific spec, e.g. the post-job form render check:

```bash
npx playwright test -c playwright.smoke.ts tests/smoke/post-job-form-render.spec.ts
```

In CI these run as part of the **Release Check (PR smoke)** workflow.
