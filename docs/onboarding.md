# Onboarding Flow

## New user
1. Auth → redirect to `/profile?onboarding=1`
2. Complete profile (Step 1 of 2)
3. Redirect based on `can_post_job`:
   - Can post → `/gigs/new` with banner “Let’s post your first job”
   - Otherwise → `/gigs` with banner “Profile complete — start exploring gigs”

## Returning user
- Auth → `/gigs`

## Banners
- Auth success: “Signed up. Check email if confirmation is required.”
- Profile save: “Saved!” then onboarding banners above.
