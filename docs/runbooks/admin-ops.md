# Admin & Ops Runbook

## Payments (GCash)
- Queue: `/admin/payments`
- Approve → credits tickets; Reject → email goes to user with reason.
- Common errors: duplicate reference → DB unique guard.

## Reviews Moderation
- `/admin/reviews`
- Hide abusive reviews with a reason (stored in `hidden_reason`).
- Unhide if appealed and valid.

## Feature Flags
- `/admin/flags`
- Toggle keys to stage features. Client reads flags via `feature_flags` (public select policy).

## User Suspension
- `/admin/users`
- Suspend → sets `profiles.suspended_at` (app checks should block posting/applying).
