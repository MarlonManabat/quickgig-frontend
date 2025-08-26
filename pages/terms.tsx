import Shell from "@/components/Shell";

export default function TermsPage() {
  return (
    <Shell>
      <h1 className="text-2xl font-bold mb-4">
        Terms of Service — QuickGig.ph
      </h1>
      <div className="space-y-6 text-sm">
        <section>
          <h2 className="font-semibold text-lg mb-2">Acceptance of Terms</h2>
          <p>By using QuickGig.ph, you agree to these Terms of Service.</p>
        </section>
        <section>
          <h2 className="font-semibold text-lg mb-2">
            Eligibility &amp; Accounts
          </h2>
          <p>
            You must be at least 18 years old and provide accurate information
            to create an account.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-lg mb-2">Platform Role</h2>
          <p>
            QuickGig is a marketplace. We do not employ workers and we do not
            guarantee outcomes.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-lg mb-2">Tickets &amp; Payments</h2>
          <p>
            Employers purchase tickets to post or contact workers. Promotional
            tickets may be granted for free. Tickets are consumed on a
            successful match or engagement per product rules and have no cash
            value.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-lg mb-2">User Conduct</h2>
          <p>
            Provide accurate information and use the service lawfully. No spam
            or fraud.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-lg mb-2">Content &amp; IP</h2>
          <p>
            You retain ownership of your content but grant us a license to
            display it on the platform.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-lg mb-2">Reviews &amp; Ratings</h2>
          <p>Reviews must be truthful. We may moderate or remove reviews.</p>
        </section>
        <section>
          <h2 className="font-semibold text-lg mb-2">Disputes</h2>
          <p>
            Users must resolve disputes between themselves. We may provide
            limited tools but are not a party to disputes.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-lg mb-2">
            Limitation of Liability
          </h2>
          <p>
            QuickGig is provided &quot;as is&quot; without indirect or consequential
            damages.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-lg mb-2">
            Changes &amp; Termination
          </h2>
          <p>We may update these terms or suspend accounts for violations.</p>
        </section>
        <section>
          <h2 className="font-semibold text-lg mb-2">Governing Law</h2>
          <p>These terms are governed by the laws of the Philippines.</p>
        </section>
        <section>
          <p>
            Contact us at{" "}
            <a href="mailto:support@quickgig.ph" className="underline">
              support@quickgig.ph
            </a>
            .
          </p>
        </section>
      </div>
    </Shell>
  );
}
