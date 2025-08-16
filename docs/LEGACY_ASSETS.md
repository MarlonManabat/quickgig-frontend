# Legacy Assets (Marketing)

Place the real static assets here:

- `public/legacy/styles.css` – legacy marketing stylesheet.
- `public/legacy/index.fragment.html` – HTML fragment for `/`.
- `public/legacy/login.fragment.html` – HTML fragment for `/login`.
- Optional images & fonts under `public/legacy/img/**` and `public/legacy/fonts/**`.

## Notes
- Use root-relative URLs inside fragments (e.g., `/legacy/img/hero.png`).  
  The server helper rewrites relative `src`/`href` to `/legacy/...` automatically.
- Any `<form>` posting to `login&#46;php` is rewritten to `action="/api/session/login" method="post"`.
- Toggle the experience with `NEXT_PUBLIC_LEGACY_UI=true|false`.
- You can add a site banner via `NEXT_PUBLIC_BANNER_HTML`.
