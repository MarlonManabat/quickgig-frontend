### 2025-09-05 — CI guardrails (lockfile self-heal + strict checks)

- Added **Lock Guard** that checks out the PR branch, runs `npm install`, and pushes a refreshed `package-lock.json` back to the PR.
- Kept required checks strict with `npm ci` for **Lint**, **Type Check**, and **Smoke (PR)**.
- Deduped workflow names and concurrency groups to stop shadow/duplicate runs.
- Outcome: PRs with stale lockfiles auto-heal, and required checks become green once re-run.
