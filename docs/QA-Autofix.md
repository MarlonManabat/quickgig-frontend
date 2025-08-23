# QA Autofix

This repository includes utilities and scripts to audit navigation and fix common issues.

## Codemod

The codemod replaces unsafe `href` and `router.push` usages with `LinkSafe` and `safePush`, inserting parameter placeholders when dynamic segments are detected.

## Usage

```
npm run lint:href
npm run fix:href
npm run build
PLAYWRIGHT_BASE_URL=https://<preview-or-prod> npm run qa:smoke
```

Applications detail fetch now waits for a valid id before requesting data; empty and error states are exposed for testing.
Note: PR10 uses SWR for conditional client-side fetch; added "swr" as a dependency.
PR10 uses SWR for conditional fetch. Applications detail embeds:
- gig:gigs(..., owner_profile:profiles(full_name))
- applicant_profile:profiles!applications_applicant_fkey(full_name)

## Passwordless Auth

- Callback path `/auth/callback`
- `postAuthRedirect` is stored in `localStorage` to remember the intended page
- First sign-in upserts the user's profile row
- Supabase Auth settings must include the callback URL

## Admin seeding

Set `SEED_ADMIN_EMAIL` locally and in CI so an account is marked as admin during seeding.

## Forms

Standard form components live in `components/forms`:

```
<FormShell title="...">
  <EmailField id="email" label="Email address" value={email} onChange={...} />
</FormShell>
```

Inputs use responsive full-width classes and a `min-w-0` wrapper via `FieldRow` to prevent clipping.

### CTA focus convention

CTA links can pass `?focus=` in the query string. Destination pages call `focusFromQuery` to focus a selector:

```
focusFromQuery('focus', { email: '#email', search: '#search', title: '#title' });
```

QA screenshots should capture the focused field after navigation when testing CTAs.
