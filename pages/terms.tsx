import Shell from "@/components/Shell";

export default function TermsPage() {
  return (
    <Shell>
      <h1 className="text-2xl font-bold mb-4">Terms of Service</h1>
      <p className="mb-4">Effective Date: August 23, 2025</p>
      <div className="space-y-6 text-sm">
        <section>
          <h2 className="font-semibold text-lg mb-2">1. Eligibility</h2>
          <p>You must be at least 18 years old to use QuickGig. By signing up, you confirm you are legally able to enter into binding agreements.</p>
        </section>
        <section>
          <h2 className="font-semibold text-lg mb-2">2. Account Responsibilities</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>You are responsible for maintaining the confidentiality of your account.</li>
            <li>You agree to provide accurate information and not impersonate others.</li>
          </ul>
        </section>
        <section>
          <h2 className="font-semibold text-lg mb-2">3. Services</h2>
          <p>QuickGig is a platform that connects employers posting jobs ("Clients") with freelancers ("Workers"). QuickGig does not become a party to any contract between Clients and Workers.</p>
        </section>
        <section>
          <h2 className="font-semibold text-lg mb-2">4. Tickets &amp; Payments</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Clients purchase tickets to post jobs.</li>
            <li>The first ticket may be free as part of promotional onboarding.</li>
            <li>Tickets are consumed only after a job is successfully agreed between Client and Worker.</li>
            <li>Workers do not pay to use the platform.</li>
          </ul>
        </section>
        <section>
          <h2 className="font-semibold text-lg mb-2">5. Prohibited Activities</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Post unlawful or fraudulent jobs.</li>
            <li>Misuse the platform for spam, harassment, or illegal activity.</li>
            <li>Circumvent payments or ticket usage outside QuickGig.</li>
          </ul>
        </section>
        <section>
          <h2 className="font-semibold text-lg mb-2">6. Disclaimers</h2>
          <p>QuickGig is provided "as is" without warranties of any kind. QuickGig does not guarantee job quality, Worker performance, or Client payment reliability.</p>
        </section>
        <section>
          <h2 className="font-semibold text-lg mb-2">7. Limitation of Liability</h2>
          <p>QuickGig shall not be liable for indirect, incidental, or consequential damages arising from use of the platform.</p>
        </section>
        <section>
          <h2 className="font-semibold text-lg mb-2">8. Termination</h2>
          <p>We may suspend or terminate accounts that violate these Terms.</p>
        </section>
        <section>
          <h2 className="font-semibold text-lg mb-2">9. Governing Law</h2>
          <p>These Terms are governed by the laws of the Philippines.</p>
        </section>
        <section>
          <p>If you have questions, contact us at <a href="mailto:support@quickgig.ph" className="underline">support@quickgig.ph</a>.</p>
        </section>
      </div>
    </Shell>
  );
}

