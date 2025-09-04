## PR Smoke Guardrails (read me first)
- Do **not** use `cta-post-job` / `cta-my-applications` testIds. Use `nav-post-job` / `nav-my-applications`.
- For auth-gated routes, accept `/login?next=…` as valid using `expectAuthAwareRedirect`.
- Ensure `post-job-skeleton` remains available for client-side checks.
- Before opening a PR, run:
  ```bash
  npm run no-legacy
  ```
