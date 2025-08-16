# Legacy Assets (Marketing)

Place the real static assets here:

- `public/legacy/styles.css` – legacy marketing stylesheet.
- `public/legacy/index.fragment.html` – HTML fragment for `/`.
- `public/legacy/login.fragment.html` – HTML fragment for `/login`.
- `public/legacy/header.fragment.html` – legacy header (optional).
- `public/legacy/footer.fragment.html` – legacy footer (optional).
- Optional images & fonts under `public/legacy/img/**` and `public/legacy/fonts/**`.

## Notes
- Use root-relative URLs inside fragments (e.g., `/legacy/img/hero.png`).  
  The server helper rewrites relative `src`/`href` to `/legacy/...` automatically.
- Any `<form>` posting to `login&#46;php` is rewritten to `action="/api/session/login" method="post"`.
- Toggle the experience with `NEXT_PUBLIC_LEGACY_UI=true|false` and `NEXT_PUBLIC_LEGACY_STRICT_SHELL=true|false`.
- You can add a site banner via `NEXT_PUBLIC_BANNER_HTML`.
- Banner HTML is sanitized on the server and injected into the legacy header slot.
- Any `favicon.*` placed under `public/legacy/img` will override the default favicon.

## Sync & verify locally

Run the helper scripts to pull fragments from the live site and check them in:

```bash
npm run legacy:sync -- --source=https://app.quickgig.ph
npm run legacy:verify      # fails if required assets are missing
npm run legacy:check       # grep for stray login\u002ephp references
```

Expected layout after sync:

```
public/legacy/
  ├─ styles.css
  ├─ index.fragment.html
  ├─ login.fragment.html
  ├─ header.fragment.html (optional)
  ├─ footer.fragment.html (optional)
  └─ img/...
```

## Vercel environment

In Vercel Preview and Production, set:

```
NEXT_PUBLIC_LEGACY_UI=true
NEXT_PUBLIC_LEGACY_STRICT_SHELL=true
NEXT_PUBLIC_BANNER_HTML=""
```

Deploy after saving the variables.
