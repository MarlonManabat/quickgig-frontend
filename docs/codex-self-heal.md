# Codex Self-Heal

PRs labeled with `codex` automatically recover from failing smoke tests.

When the `e2e_smoke` job in **Release Check (PR smoke)** fails:

1. CI uploads Playwright traces, videos and screenshots under the `smoke-artifacts/` artifact and comments links on the PR.
2. A follow up workflow (`codex-self-heal.yml`) downloads the artifacts, discovers the Vercel preview URL and invokes Codex to diagnose and push a fix.
3. Codex commits directly to the PR branch. For forks, it opens a patch PR from a `codex/fix-<sha>` branch.

To opt in, add the `codex` label to your pull request. Remove the label to skip self-healing.

Artifacts and Vercel preview links appear in the failure comment and in the workflow run artifacts.
