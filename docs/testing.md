# End-to-End Smoke Tests

Run Playwright smoke tests locally:

```bash
npm ci
npm run playwright:install
BASE=http://localhost:3000 npm run test:e2e:smoke
npm run test:e2e:report
```

Pull request checks run in non-blocking mode, while nightly and manual workflows provide stronger signal.
