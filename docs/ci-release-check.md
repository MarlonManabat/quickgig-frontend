# CI Release Check

This repository uses GitHub Actions to validate releases against Vercel preview deployments.

## Secrets

Workflows expect the following secrets:

- `VERCEL_TOKEN`
- `VERCEL_PROJECT_ID`
- `VERCEL_ORG_ID` (optional)
- `QA_TEST_EMAIL`
- `QA_TEST_SECRET`
- `SEED_ADMIN_EMAIL` (optional)
- `NEXT_PUBLIC_SITE_URL` (for pushes to `main`)

## Workflow summary

- **Pull requests** run three workflows: `Release Check`, `Smoke`, and `E2E`.
- **Pushes to `main`** trigger only `Release Check` which uses `NEXT_PUBLIC_SITE_URL` instead of a preview.

Each workflow installs dependencies, retrieves the Vercel preview URL, seeds deterministic data, runs Playwright tests and uploads artifacts from `playwright-report` and `test-results`.

## Viewing artifacts

Open the workflow run and download the uploaded artifact archive. It contains Playwright reports, traces and videos for failing tests.

## Running tests locally

To run smoke or E2E tests against a preview deployment:

```bash
export BASE_URL="https://preview.example.com"
npm run test:smoke:ci
npm run test:e2e:ci
```

## Bundle analyzer

Enable the Next.js bundle analyzer locally or in CI by setting `ANALYZE=true`:

```bash
ANALYZE=true npm run build
```
