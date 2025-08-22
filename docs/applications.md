# Applications

Applications link a gig to an applicant. Row level security ensures only:

- the applicant
- the gig owner
- admins

can view a given application and its thread.

Each application has a single messaging thread. When a message is sent, a row is
inserted into `notifications` for the other participant with `type = 'message'`
and a JSON payload containing the `application_id`, `thread_id` and a short
`preview` of the body. A dedicated notifications UI will come later.
