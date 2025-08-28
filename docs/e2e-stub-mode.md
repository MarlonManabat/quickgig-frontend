# E2E stub mode

Test helpers avoid real authentication and are only available on Vercel preview
deployments or when `CI=true`.

- `POST /api/test/login` sets `qg_test_role` and `qg_test_uid` cookies for
  `worker`, `employer`, or `admin`.
- `POST /api/test/logout` clears the test cookies.
- `POST /api/test/seed` performs minimal seeding.

These endpoints return `403` elsewhere, so they are safe for deployed builds.
