# Local CTA/Link Audits

Ensure you are in the repository root and using the Node version from `.nvmrc`:

```bash
nvm use
```

Install dependencies:

```bash
npm ci
```

Run the audit:

```bash
npm run audit:links --silent
# or explicitly:
BASE_URLS="https://quickgig.ph,https://app.quickgig.ph,https://preview-quickgig.vercel.app,https://preview-app.vercel.app" \
node scripts/check-cta-links.mjs
# or with wrapper:
npm run audit:links:urls -- "https://quickgig.ph,https://app.quickgig.ph,https://preview-quickgig.vercel.app,https://preview-app.vercel.app"
```

Exit codes: `0` means all links returned 2xx responses, `1` indicates at least one 4xx/5xx response. A summary of non-2xx results prints to stdout.
