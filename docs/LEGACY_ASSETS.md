# Legacy Asset Sync

The marketing homepage (`/`) and login (`/login`) use HTML fragments and CSS pulled from the live site `app.quickgig.ph`.
The script `npm run sync:legacy` downloads those pages, rewrites asset paths, and stores everything under
`public/legacy/`.

## Workflow

```bash
npm run sync:legacy    # fetch pages + assets
npm run legacy:check   # lint fragments and verify required files
```

The sync script produces:

- `public/legacy/styles.css`
- `public/legacy/index.fragment.html`
- `public/legacy/login.fragment.html`
- assets in `public/legacy/img/**`, `public/legacy/fonts/**`, ...

Fragments exclude `<html>`, `<head>`, `<body>`, and any `<script>` tags.
The login form is normalized to `method="POST" action="/api/session/login"`.

## Notes

* All asset references are rewritten to `/legacy/...` paths.
* Re-run the sync whenever the legacy site changes.
* `legacy:verify` fails if the fragments are missing or if any source references the old login endpoint.
