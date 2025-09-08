export default function PostJobPage() {
  return (
    <main className="container mx-auto px-4 py-10">
      {/* Ensure a visible heading for smoke test */}
      <h1 className="text-xl font-semibold mb-2">Post a Job</h1>
      {/* keep the rest of the form unchanged */}
      <p className="text-neutral-600 mb-6">Employer tools are almost ready. Join the waitlist and we’ll notify you.</p>
      <a className="inline-flex items-center rounded-xl px-4 py-2 border" href="mailto:hello@quickgig.ph?subject=Employer%20waitlist">Join the employer waitlist</a>
    </main>
  );
}
