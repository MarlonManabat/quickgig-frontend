# QA Suite

## Running locally

```bash
BASE_URL=http://localhost:3000 npx playwright test --project=qa
```

### Audit CTA links

```bash
BASE_URLS="https://quickgig.ph,https://app.quickgig.ph" npm run audit:links
```

## Artifacts

After a run the Playwright HTML report and media artifacts (screenshots, videos, traces) are saved under `playwright-report` and `test-results`. The crawler also writes `tests/qa/coverage.json` with a map of visited routes and counts. These are uploaded in CI as artifacts named `qa-report` and `qa-coverage`.

## Self-heal loop

The `qa.yml` workflow triggers the Codex self-heal workflow whenever the QA run fails. The loop waits for a patch commit from **ChatGPT Codex Connector** and re-runs up to `MAX_HEAL_ROUNDS` (default `2`). Override by setting the `MAX_HEAL_ROUNDS` environment variable when dispatching the workflow.
