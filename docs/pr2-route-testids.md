# Route & test ids summary

- `/auth` now serves the login form from `pages/login` and includes an email field with `id="email"` and primary button `data-testid="magic-link"`.
- `/auth/callback` shows a plain "Login failed" page when running in CI or test mode.
- `/find` redirects client-side to `/search?focus=search` and preserves query params.
- `/search` provides a minimal page with an auto-focused `<input data-testid="search" />` when `focus=search`.
- Home CTA buttons expose `data-testid="cta-findwork"` and `data-testid="cta-postjob"`; the Find Work CTA links to `/find?focus=search`.
- App headers across layouts use `data-app-header="true"` and keep the brand link visible.
- `/profile` includes a visible save button `data-testid="profile-save"`.
- Visiting `/admin` as a non-admin triggers a client-side redirect to `/`.
