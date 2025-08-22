# QA

## Running E2E locally

```
PLAYWRIGHT_BASE_URL=http://localhost:3000 npm run test:e2e
```

## href linter & codemod

- `npm run lint:href` checks for dynamic route links like `/applications/[id]` without actual params.
- `npm run fix:href` attempts a safe auto-fix. If it cannot determine the right variable, it leaves a `TODO` comment; replace the placeholder with real code and remove the comment.
