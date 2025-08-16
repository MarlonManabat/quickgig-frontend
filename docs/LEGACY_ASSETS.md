# Legacy Assets: Copy Checklist

This app renders legacy marketing pages by inlining HTML *fragments* and CSS from **/public/legacy**.
Follow this checklist to achieve pixel-perfect parity with `app.quickgig.ph`.

## 1) Copy files into `public/legacy/`
Required:
- `public/legacy/styles.css`
- `public/legacy/index.fragment.html`   ← legacy home hero + body *without* <html>, <head>, <body>
- `public/legacy/login.fragment.html`   ← legacy login section only

Optional (if referenced by the HTML/CSS):
- `public/legacy/img/**`
- `public/legacy/fonts/**`

> Tip: Keep the original relative structure under `/legacy/*` so refs stay simple.

## 2) Fix all URLs to be root-relative
In the fragments:
```html
<link rel="stylesheet" href="/legacy/styles.css">
<img src="/legacy/img/hero.png" alt="">
```
Avoid `../` paths. Avoid external Hostinger URLs for images.

## 3) KEEP FRAGMENTS SAFE

* **NO `<script>` tags** inside fragments.
* **NO `action="https://quickgig.ph/login.php"`** — the app posts to **`/api/session/login`**.
* Forms should point to in-app routes or be handled client-side.

## 4) Verify locally

```bash
npm run legacy:tree
npm run legacy:verify
```

The verifier checks for missing files, unsafe tags, and any `login.php` refs.

## 5) Deploy

Commit the copied files and push. In Vercel, ensure:

* `NEXT_PUBLIC_SHOW_API_BADGE=false` (optional; hides red badge)
* (No other env is needed for parity.)

## Troubleshooting

* If images don't load, check that the fragment uses `/legacy/...` paths.
* If build fails, run `npm run legacy:verify` and fix reported lines.

