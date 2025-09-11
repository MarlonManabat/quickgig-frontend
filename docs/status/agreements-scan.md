# Agreements Scan

Generated: 2025-09-11T15:07:08.061Z

## Summary

- Models detected for applications, agreements, and tickets.
- API handlers exist for agreement confirm, cancel, and application accept.
- Logic helpers for creating agreements from applications and ticket debit present; ticket refund logic present.
- Tests mention ticket spend/refund and agreement flow.

## Details

| Section | Item | Found | Sample paths |
| --- | --- | --- | --- |
| models | applications | true | src/lib/applications/server.ts |
| models | agreements | true | src/lib/agreements.ts |
| models | tickets | true | src/lib/tickets.ts |
| apis | applications_accept | true | src/app/api/applications/[id]/accept/route.ts |
| apis | agreements_confirm | true | src/app/api/agreements/[id]/confirm/route.ts |
| apis | agreements_cancel | true | src/app/api/agreements/[id]/cancel/route.ts |
| logic | create_agreement_from_application | true | src/lib/agreements.ts |
| logic | tickets_debit | true | supabase/migrations/20250911224500_tickets_debit_rpc.sql |
| logic | tickets_refund | true | supabase/migrations/20250825004500_tickets_and_agreements.sql |
| tests | ticket_spend | true | src/app/api/agreements/[id]/confirm/route.ts |
| tests | ticket_refund | true | src/app/api/agreements/[id]/cancel/route.ts |
| tests | agreement_flow | true | src/app/agreements/[id]/page.tsx |
