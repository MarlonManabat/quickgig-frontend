# QuickGig Frontend

A Next.js application for QuickGig.ph configured for deployment on Vercel.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env.local` and adjust as needed:
   ```env
   NEXT_PUBLIC_API_URL=https://api.quickgig.ph
   ```

## Authentication

The app communicates with an external API using the `/src/lib/api.ts` helper. When `auth` is set on a request, a JWT token stored in `localStorage` is sent in the `Authorization` header. If the backend issues HttpOnly cookies, they are included automatically.

Tokens are managed through `/src/lib/auth.ts`, and basic route protection is available via `/src/lib/withAuth.tsx`.

## Development

Run the development server:

```bash
npm run dev
```

## Deployment

This project is configured for Vercel. Connect the repository to Vercel and ensure the `NEXT_PUBLIC_API_URL` environment variable is set in your project settings.

## API (Hostinger) Setup

The `api.quickgig.ph` directory contains a lightweight PHP API that deploys to Hostinger. Deployment is automated via the GitHub Action in `.github/workflows/deploy.yml` which uploads the API to `/public_html/api/` over FTP.

### Environment variables

In the Hostinger control panel for the `api` subdomain, configure the following environment variables:

- `DB_HOST`
- `DB_NAME`
- `DB_USER`
- `DB_PASS`
- `JWT_SECRET`
- `CORS_ORIGIN` (optional, comma separated, defaults to `https://quickgig.ph,https://www.quickgig.ph`)

### SQL schema

Create the database tables by running:

```sql
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  event_date DATETIME NOT NULL,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS tickets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_id INT NOT NULL,
  holder_name VARCHAR(160) NOT NULL,
  status ENUM('reserved','paid','cancelled') DEFAULT 'reserved',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES events(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### Manual steps

Some infrastructure settings still need to be configured manually:

1. **Hostinger → Subdomains**: create `api` with document root `/public_html/api`.
2. **Hostinger → SSL**: enable Let's Encrypt for `api.quickgig.ph`.
3. **Hostinger → Environment Variables**: set the variables listed above.
4. **Hostinger → DNS Zone**:
   - `@` A → `76.76.21.21` (Vercel)
   - `www` CNAME → `cname.vercel-dns.com`
5. **Vercel → Project → Domains**: add `quickgig.ph` and optionally `www`.
6. **Vercel → Settings → Env Vars**: set `NEXT_PUBLIC_API_URL=https://api.quickgig.ph` and redeploy.

