# Gigs CRUD

This document describes how gigs are created, listed, viewed and edited within the QuickGig frontend (pages router). Gigs represent job postings.

## Fields

A gig record includes the following fields:

- **title** (string): short title.
- **description** (text): detailed description.
- **budget** (numeric, nullable): optional budget for the job.
- **city** (string): location or city where the work is based.
- **image_url** (string, nullable): public URL to an image uploaded to Supabase Storage.
- **published** (boolean): whether the gig is visible to the public.
- **user_id** (UUID): reference to the profile that created the gig.

Additional system fields such as `id`, `created_at`, and `updated_at` are present automatically.

## Listing gigs

The page `/gigs` queries the `gigs` table using the Supabase client and shows only gigs where `published = true`, ordered by `created_at` descending. Each gig links to its detail page at `/gigs/[id]`. If a user has permission to post gigs, a link to `/gigs/new` is shown.

## Creating a gig

Authenticated users can create a gig via `/gigs/new`. The page uses the reusable `GigForm` component to capture inputs for the fields above. On submission, it:

1. Uses the `uploadPublicFile` helper to store an uploaded image in the `gigs` folder of Supabase Storage (optional).
2. Inserts a new row into the `gigs` table with the provided values and the current user's `id`.
3. Redirects to `/gigs/{id}` after a successful insert.

## Viewing and editing

- **View:** `/gigs/[id].tsx` displays a single gig. It fetches the gig by id; anyone can view published gigs.
- **Edit:** `/gigs/[id]/edit.tsx` allows the owner of the gig to update the fields. It reuses `GigForm` and updates the record via `supabase.from('gigs').update().eq('id', id)`. The page is gated by `useRequireUser` and checks that the current user matches the gig's `user_id` before allowing edits.

## Row‑level security

The database enforces row‑level security (RLS). Policies should ensure:

- Public `select` on `gigs` is allowed only for rows where `published = true`.
- Authenticated users can select and update their own gigs.
- Only the owner can update or delete a gig.
- Inserting a gig automatically sets `user_id` to `auth.uid()`.

These rules are defined in the Supabase project and should be kept in sync with this frontend implementation.
