# CI Smoke Policy

- **PRs:** Smoke runs but is **non-blocking** (`continue-on-error: true`). Use it for signal; do not block merges.
- **Main (nightly):** Smoke is **enforced** daily at 18:00 UTC. Failures auto-create/update issues with artifacts.
- Required checks kept: contract verify, lint, typecheck (and existing guards).
