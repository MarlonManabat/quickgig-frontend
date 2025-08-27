# QA

## Smoke tests

Run smoke tests against deployed app:

```
PLAYWRIGHT_BASE_URL=https://app.quickgig.ph npx playwright test --project=smoke
```

## Full suite

Trigger full E2E workflow manually:

```
gh workflow run e2e-full-manual.yml
```
