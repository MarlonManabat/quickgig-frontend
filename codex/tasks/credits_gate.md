Title: Server-side credits gate for /jobs/new
Constraints: redirect unauth -> /auth; gate on credits<=0; show form when >0; decrement on success.
Acceptance: No blank screens; smoke green.
