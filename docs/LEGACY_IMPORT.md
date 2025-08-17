# Legacy asset import

## Prerequisites

Set the following environment variables while validating the legacy UI:

```sh
export NEXT_PUBLIC_LEGACY_UI=true
export NEXT_PUBLIC_LEGACY_STRICT_SHELL=true # optional
```

## Render the legacy shell

```env
# Flags
NEXT_PUBLIC_LEGACY_UI=true
NEXT_PUBLIC_LEGACY_STRICT_SHELL=true
NEXT_PUBLIC_SHOW_API_BADGE=false
NEXT_PUBLIC_BANNER_HTML='<div class="mx-auto max-w-6xl px-4 py-2 text-center text-sm rounded-xl border border-[var(--legacy-cta-outline)] shadow-[var(--legacy-shadow)]" style="background:radial-gradient(100% 120% at 0% 0%, var(--legacy-bg-start), var(--legacy-bg-end));color:var(--legacy-hero-text)"><strong>Heads up:</strong> Beta preview of the new QuickGig.ph experience.</div>'
```

The banner value must be on a single line or escaped properly if multi-line. Redeploy after changing environment variables.

## Import

```sh
npm run legacy:import -- --from "$HOME/QuickGig Project/frontend/public/legacy"
npm run legacy:verify
```

## Commit & PR

```sh
git checkout -b chore/import-real-legacy
git add public/legacy
git commit -m "chore(legacy): import real legacy fragments, css, and assets"
git push -u origin chore/import-real-legacy
```

## Troubleshooting

- Ensure `styles.css`, `index.fragment.html`, and `login.fragment.html` exist in the source directory.
- Asset paths are rewritten to `/legacy/img/...` and `/legacy/fonts/...` automatically.
- Missing `img` or `fonts` folders produce warnings but do not stop the import.
- `logo-icon.png` is copied to `public/favicon.png` if present; absence is not an error.
