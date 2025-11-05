# QuickGig.ph Database Setup

## Overview

This document explains how to set up the Supabase database for QuickGig.ph with all migrations and seed data.

## Prerequisites

- Supabase project created
- Supabase CLI installed (or use Supabase dashboard)
- Environment variables configured in Vercel

## Database Schema

The database includes the following tables:

### Core Tables
- **profiles** - User profiles linked to auth.users
- **gigs** - Job postings with location, budget, and status
- **applications** - Job applications from users
- **threads** - Message threads for applications
- **messages** - Messages within threads
- **offers** - Job offers to applicants

### Ticketing System
- **ticket_balances** - User ticket balances
- **ticket_ledger** - Ticket transaction history
- **orders** - Payment orders for ticket purchases

### Additional Features
- **notifications** - User notifications
- **reviews** - Reviews and ratings
- **saved_gigs** - Saved/bookmarked jobs
- **client_errors** - Frontend error logging

## Setup Steps

### 1. Apply All Migrations

Run all migration files in order:

```bash
cd supabase
supabase db push
```

Or manually apply each migration file in the Supabase SQL editor.

### 2. Seed the Database

Run the seed file to create sample data:

```bash
psql $DATABASE_URL < seed.sql
```

Or copy the contents of `seed.sql` into the Supabase SQL editor and execute.

### 3. Configure Environment Variables

Add these to Vercel (already in vercel.json):

```
NEXT_PUBLIC_SUPABASE_URL=https://duhczsmefhdvhohqlwig.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_anon_key>
NEXT_PUBLIC_SITE_URL=https://app.quickgig.ph
TICKET_PRICE_PHP=20
FREE_TICKETS_ON_SIGNUP=3
```

## Sample Data

The seed file creates:

- **3 users** (Maria Santos, Juan Dela Cruz, Admin User)
- **10 published gigs** across different Philippine regions
- **Ticket balances** for all users (10 tickets each, 100 for admin)

## Business Model

### Ticketing System

- Users get **3 free tickets** on signup
- Each job application costs **1 ticket**
- Users can purchase more tickets for **₱20 each**
- Payment via GCash with proof upload

### Job Posting

- Employers can post jobs (requires at least 1 ticket)
- Jobs include: title, description, budget, location, region
- Jobs can be marked as remote or on-site

### Applications

- Applicants spend 1 ticket per application
- Applications create message threads
- Employers can send offers through the system

## Row Level Security (RLS)

All tables have RLS enabled with policies for:
- Users can read their own data
- Admins can read/write all data
- Published gigs are publicly readable
- Applications are visible to applicant and gig owner

## Functions

Key database functions:
- `credit_tickets_admin()` - Admin grants tickets
- `debit_tickets()` - Spend a ticket
- `grant_welcome_tickets()` - Auto-grant on signup
- `is_admin()` - Check if user is admin

## Testing

After setup, verify:

1. Browse jobs page shows 10 sample gigs
2. Job detail pages load correctly
3. Login creates a profile with 3 free tickets
4. Job application spends 1 ticket
5. Messaging works between applicant and employer

## Production Checklist

- [ ] All 62 migrations applied
- [ ] Seed data loaded
- [ ] Environment variables set in Vercel
- [ ] RLS policies tested
- [ ] Authentication working
- [ ] Ticket system functional
- [ ] Payment flow tested

---

For issues, check Supabase logs and Vercel deployment logs.
