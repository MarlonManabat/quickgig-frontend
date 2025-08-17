# Dev Bootstrap Runbook

## Bootstrap everything
First time or after pulling main:

```
npm run bootstrap
```

This fetches and rebases onto `origin/main`, installs dependencies, and verifies legacy assets.

## Check legacy assets only
Just check assets:

```
npm run legacy:check
```

## Required assets
Copy these into `public/legacy/`:

- `public/legacy/styles.css`
- `public/legacy/index.fragment.html`
- `public/legacy/login.fragment.html`
- (warn) `public/legacy/img/logo-main.png`
- (warn) `public/legacy/img/logo-horizontal.png`
- (warn) `public/legacy/img/logo-icon.png`
- (warn) custom fonts under `public/legacy/fonts/`

## Troubleshooting
- **Network issue; retry later** – GitHub unreachable or offline.
- **Resolve conflicts then re-run: npm run bootstrap** – rebase reported conflicts.
