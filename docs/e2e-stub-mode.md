# E2E stub mode

Test helpers avoid real authentication and are only available when `NODE_ENV` is not `production`.

- `POST /api/test/login` sets `qa_role` and `qa_uid` cookies for `worker`, `employer`, or `admin`.
- `POST /api/test/logout` clears the test cookies.
- `POST /api/test/seed` performs minimal seeding.

These endpoints return `404` in production, so they are safe for deployed builds.
