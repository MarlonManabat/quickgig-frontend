### 2025-09-05 — CI lockfile self-heal made merge-safe
- Fixed Lock Guard to checkout `github.head_ref` and push with `GITHUB_TOKEN` (no more detached-HEAD).
- Removed seed/duplicate workflows that created shadow checks.
- Canonicalized required checks to: Lint/eslint, Type Check/tsc, Smoke (PR)/pr.
- Outcome: required checks go green; PRs can merge without manual interventions.
