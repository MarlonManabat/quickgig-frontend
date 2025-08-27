# E2E stub mode

Set `E2E_STUB=1` to enable lightweight test helpers that avoid real authentication.

- `POST /api/test/login` sets a `qg_role` cookie for `worker`, `employer`, or `admin`.
- `POST /api/test/seed` performs minimal seeding and responds only when stub mode is active.

These endpoints return `404` unless `E2E_STUB` is enabled, so they are safe for production builds.
