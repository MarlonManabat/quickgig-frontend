# Legacy Guard

Prevents real-time socket code from reaching static marketing pages (`/` and `/login`).

## Run locally

```bash
npm run check:legacy
```

## If the guard fails

Move any `socket.io-client`, `io()`, or `WebSocket` usage out of these pages or guard it behind client-only, non-marketing routes.

