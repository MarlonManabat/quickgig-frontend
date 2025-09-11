import LandingHeader from '@/components/landing/Header';
import LandingCTAs from '@/components/landing/LandingCTAs';

export default function LandingPage() {
  return (
    <>
      <LandingHeader />
        <main className="...">
          <h1>
            Kahit saan sa Pinas, <span className="accent">may gig para sa&apos;yo!</span>
          </h1>
          <p>
            Ang pinakamabilis na paraan para makahanap ng trabaho o mag-hire ng skilled professionals. Dito sa QuickGig.ph, madali lang!
          </p>
          <div className="actions">
            <LandingCTAs
              startClassName="px-4 py-2 rounded-md bg-gray-100"
              postClassName="px-4 py-2 rounded-md bg-blue-600 text-white"
              appsClassName="px-4 py-2 rounded-md bg-gray-100"
              showApps
            />
          </div>
        </main>
      </>
    );
  }
