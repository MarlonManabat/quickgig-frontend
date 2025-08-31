import Shell from "@/components/Shell";

export default function PrivacyPage() {
  return (
    <Shell>
      <h1 className="text-2xl font-bold mb-4">Privacy Policy — QuickGig.ph</h1>
      <div className="space-y-6 text-sm">
        <section>
          <h2 className="font-semibold text-lg mb-2">Information We Collect</h2>
          <p>
            We collect account information, job and gig details, communications,
            usage data, and cookies.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-lg mb-2">How We Use It</h2>
          <p>
            Data is used to operate the service, authenticate users, prevent
            fraud, provide support, analyze usage, and, with consent, for
            marketing.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-lg mb-2">Sharing</h2>
          <p>
            We may share information with service providers, for legal
            compliance, or during business transfers. We do not sell personal
            data.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-lg mb-2">Security</h2>
          <p>
            We apply reasonable safeguards but cannot guarantee absolute
            security.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-lg mb-2">Data Retention</h2>
          <p>
            Information is retained as long as necessary for the service or
            legal obligations.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-lg mb-2">Your Rights</h2>
          <p>
            You may request access, correction, deletion, or withdrawal of
            consent by contacting us.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-lg mb-2">
            International Transfers
          </h2>
          <p>Data may be processed in other countries as required.</p>
        </section>
        <section>
          <h2 className="font-semibold text-lg mb-2">Children’s Privacy</h2>
          <p>The service is not intended for individuals under 18.</p>
        </section>
        <section>
          <h2 className="font-semibold text-lg mb-2">Updates to this Policy</h2>
          <p>We may update this policy from time to time.</p>
        </section>
        <section>
          <p>
            Contact us at{" "}
            <a href="mailto:privacy@quickgig.ph" className="underline">
              privacy@quickgig.ph
            </a>
            .
          </p>
        </section>
      </div>
    </Shell>
  );
}
