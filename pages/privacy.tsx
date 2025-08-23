import Shell from "@/components/Shell";

export default function PrivacyPage() {
  return (
    <Shell>
      <h1 className="text-2xl font-bold mb-4">Privacy Policy</h1>
      <p className="mb-4">Effective Date: August 23, 2025</p>
      <div className="space-y-6 text-sm">
        <section>
          <h2 className="font-semibold text-lg mb-2">1. Information We Collect</h2>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Account Information</strong>: name, email, password.</li>
            <li><strong>Profile Information</strong>: skills, resume, job preferences.</li>
            <li><strong>Usage Data</strong>: pages visited, actions taken on the platform.</li>
            <li><strong>Communications</strong>: messages between Clients and Workers.</li>
          </ul>
        </section>
        <section>
          <h2 className="font-semibold text-lg mb-2">2. How We Use Information</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>To operate and improve QuickGig.</li>
            <li>To facilitate job postings and matches.</li>
            <li>To communicate important updates.</li>
            <li>To comply with legal obligations.</li>
          </ul>
        </section>
        <section>
          <h2 className="font-semibold text-lg mb-2">3. Sharing of Information</h2>
          <p>We do not sell personal data. We may share limited information with:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Service providers (e.g. hosting, payment processors).</li>
            <li>Legal authorities, if required by law.</li>
          </ul>
        </section>
        <section>
          <h2 className="font-semibold text-lg mb-2">4. Data Security</h2>
          <p>We use industry-standard security to protect your data. However, no method is 100% secure.</p>
        </section>
        <section>
          <h2 className="font-semibold text-lg mb-2">5. Your Rights</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Access and update your information via your account.</li>
            <li>Request deletion of your account by contacting support.</li>
          </ul>
        </section>
        <section>
          <h2 className="font-semibold text-lg mb-2">6. Cookies</h2>
          <p>QuickGig uses cookies for login sessions and analytics.</p>
        </section>
        <section>
          <h2 className="font-semibold text-lg mb-2">7. Children’s Privacy</h2>
          <p>QuickGig is not intended for individuals under 18.</p>
        </section>
        <section>
          <h2 className="font-semibold text-lg mb-2">8. Contact</h2>
          <p>If you have privacy concerns, email us at <a href="mailto:privacy@quickgig.ph" className="underline">privacy@quickgig.ph</a>.</p>
        </section>
      </div>
    </Shell>
  );
}

