# Legacy asset import

## Prerequisites

Set the following environment variables while validating the legacy UI:

```sh
export NEXT_PUBLIC_LEGACY_UI=true
export NEXT_PUBLIC_LEGACY_STRICT_SHELL=true # optional
```

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
