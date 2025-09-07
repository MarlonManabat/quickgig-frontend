# Cross-subdomain PKCE notes

Session storage is origin-scoped so users who start on `quickgig.ph` lost the
PKCE verifier when the OAuth callback landed on `app.quickgig.ph`, producing
"invalid request" errors.

We now store the verifier and state in short-lived `HttpOnly` cookies with
`Domain=.quickgig.ph` and `SameSite=Lax` so both hosts can read them. Login start
and callback are centralized on the app host and a confirming page offers a
retry when the flow is interrupted.
