# Agreements Scan

Generated: 2025-09-11T09:37:34.752Z

## Summary

- Models detected for applications, agreements, and tickets.
- API handlers exist for agreement confirm and cancel; application accept handler missing.
- Logic helpers for creating agreements from applications and ticket debit not found; ticket refund logic present.
- Tests mention ticket spend/refund and agreement flow.

## Details

| Section | Item | Found | Sample paths |
| --- | --- | --- | --- |
| models | applications | true | src/lib/applications/server.ts |
| models | agreements | true | src/lib/agreements.ts |
| models | tickets | true | src/lib/tickets.ts |
| apis | applications_accept | false | |
| apis | agreements_confirm | true | src/app/api/agreements/[id]/confirm/route.ts |
| apis | agreements_cancel | true | src/app/api/agreements/[id]/cancel/route.ts |
| logic | create_agreement_from_application | false | |
| logic | tickets_debit | false | |
| logic | tickets_refund | true | supabase/migrations/20250825004500_tickets_and_agreements.sql |
| tests | ticket_spend | true | src/app/api/agreements/[id]/confirm/route.ts |
| tests | ticket_refund | true | src/app/api/agreements/[id]/cancel/route.ts |
| tests | agreement_flow | true | src/app/agreements/[id]/page.tsx |
