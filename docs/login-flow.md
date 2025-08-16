# Login flow

The `/login` page uses the legacy markup and styling. Submissions are intercepted on the client and sent as JSON to the same-origin `/api/session/login` endpoint with `credentials: 'same-origin'`. A `200` response sets a session cookie on the server and redirects the user to `/dashboard`. Non-`200` responses show the legacy error message and return focus to the email field.

## Verification

1. `npm run lint && npm run typecheck`
2. `npm run legacy:verify`
3. `grep -RIn --exclude-dir=node_modules -E 'login\.php|quickgig\.ph/login\.php' || echo "OK: no legacy login refs"`
4. Manual: open DevTools → Network and log in. Confirm a single POST to `/api/session/login` (no CORS or preflight). On failure the error banner appears and focus returns to the email input; on success you're redirected to `/dashboard`.
