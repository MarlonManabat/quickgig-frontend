# Smoke Tests

Run the minimal smoke suite locally:

```
npx playwright test -c playwright.smoke.ts
```

Some app flows require authentication. The smoke tests treat a redirect to `/login` as a valid outcome for these pages. This keeps CI green when credentials are missing.
