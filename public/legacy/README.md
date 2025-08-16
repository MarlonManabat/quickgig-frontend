# Legacy assets for exact UI parity

Drop the **compiled** legacy CSS and body HTML fragments here:

- `styles.css` – the production CSS from app.quickgig.ph
- `fonts.css`  – `@font-face` rules if the legacy site uses custom fonts (or leave empty if not used)
- `index.fragment.html` – **BODY fragment only** of the legacy home page (no <html>, <head>, or <body>)
- `login.fragment.html` – **BODY fragment only** of the legacy login page (no <html>, <head>, or <body>)
- Put any images under `public/legacy/img/` and font files under `public/legacy/fonts/`

> Tip: open app.quickgig.ph, View Source, copy only the inner body markup for each page.
> Ensure asset URLs in your HTML/CSS point to `/legacy/...` (e.g. `/legacy/img/hero.png`).
