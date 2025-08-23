# QA

## Smoke tests

Run smoke tests against deployed app:

```
PLAYWRIGHT_APP_URL=https://app.quickgig.ph npx playwright test -c playwright.smoke.config.ts
```

## Full suite

Trigger full E2E workflow manually:

```
gh workflow run e2e.yml -f run_full=true
```
