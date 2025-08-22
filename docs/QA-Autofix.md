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
