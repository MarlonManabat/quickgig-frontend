# QuickGig PHP Backend

Minimal PHP API served at https://api.quickgig.ph.

## Environment Variables
Create a `.env` file in this directory with the following values:

```
DB_HOST=quickgig.ph
DB_NAME=CHANGE_ME
DB_USER=CHANGE_ME
DB_PASS=CHANGE_ME
JWT_SECRET=CHANGE_ME
CORS_ORIGIN=https://quickgig.ph
```

`CORS_ORIGIN` defines which frontend is allowed to call the API.

## Testing
Run a local PHP server for quick testing:

```bash
php -S localhost:8000
```

Then visit:
- `http://localhost:8000/` → `{ "name":"QuickGig PHP API", "status":"ok" }`
- `http://localhost:8000/health` → checks the database connection and returns `{ "status":"ok","db":"up" }` or an error.

## Deployment
Deployment is handled by [Deploy PHP API to Hostinger (FTP)](../.github/workflows/deploy-backend.yml).

1. Set the required GitHub Action secrets (see repository README).
2. Trigger the workflow manually or push to `main` with changes in this folder.
3. The workflow uploads the contents of `backend-php/` via FTP to Hostinger.
