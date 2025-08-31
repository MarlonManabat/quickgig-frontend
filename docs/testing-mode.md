# Testing mode during active development
- E2E and Playwright are temporarily disabled to speed up product delivery.
- CI runs: install → typecheck/lint → build → start → health check.
- Re-enable E2E when routes, data contracts, and seed are stable.
