# QuickGig API

Simple PHP API providing authentication and profile endpoints.

## Environment

```
DB_HOST=localhost
DB_NAME=quickgig
DB_USER=...
DB_PASS=...
JWT_SECRET=change_me
INSTALL_TOKEN=run_once_secret
```

## Deployment

1. Upload files to host (e.g. Hostinger).
2. Set the environment variables above.
3. Install dependencies with `composer install --no-dev`.
4. Run the migration once via:
   `https://api.quickgig.ph/tools/install.php?token=RUN_ONCE_SECRET`

## Verify

```bash
BASE=https://api.quickgig.ph
curl -i "$BASE/status"
```

Auth flow:

```bash
curl -i -X POST "$BASE/auth/register.php" -H 'Content-Type: application/json' \
  --data '{"email":"you+demo@quickgig.ph","password":"P@ssw0rd!","name":"Marlon"}' --cookie-jar c.txt
curl -s "$BASE/auth/me.php" --cookie c.txt
```
