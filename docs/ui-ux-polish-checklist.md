# UI/UX Polish Checklist

- Typography scale: 16px base, h1 32px, h2 24px, h3 20px.
- Main content capped at 1200px with 16px side padding.
- Skip link allows keyboard users to jump to main content.
- Links underline on hover/focus; buttons have 44px min height and disabled styles.
- Applications empty state offers Browse Jobs CTA (`browse-jobs-from-empty`).
- PH helpers: `formatCurrencyPHP`, `formatDatePH` used in job listings.

During QA ensure:
- Header/navigation test IDs and routes remain unchanged.
- Lint and tests pass.
