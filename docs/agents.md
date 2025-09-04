# Agents Contract
**Version:** 2025-09-06

## PR Smoke Guardrails (read me first)
- Do **not** use `cta-post-job` / `cta-my-applications` testIds. Use `nav-post-job` / `nav-my-applications`.
- For auth-gated routes, accept `/login?next=…` as valid using `expectAuthAwareRedirect`.
- Ensure `post-job-skeleton` remains available for client-side checks.
- Before opening a PR, run:
  ```bash
  npm run no-legacy
  ```

## Test hooks (smoke/e2e)
- Header desktop: `nav-browse-jobs`, `nav-post-job`, `nav-my-applications`, `nav-login`.
- Header mobile: `nav-menu-button`, `navm-browse-jobs`, `navm-post-job`, `navm-my-applications`, `navm-login`.
- Hero: `hero-browse-jobs`, `hero-post-job`.
