# QuickGig + Codex workflow

## Generate a feature PR (CLI)
```bash
# examples
npm run codex:locations
npm run codex:billing
```

Codex will:

1. create a branch
2. apply changes
3. open a PR with description

## Run automated review (local)

```bash
npm run codex:review
```

Or rely on CI if `CODEX_API_KEY` is configured.

## IDE usage

* Install Codex extension → you can run the same tasks or “Refactor with Codex” on selected files.

## Quality gates

* PR smoke must be ✅
* Full E2E (manual) for flows that touch auth/billing/posting
* Address Codex review comments before merge

