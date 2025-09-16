import Link from "next/link";
import { hostAware } from "@/lib/hostAware";

export default function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 text-center">
      <h1 className="text-4xl md:text-5xl font-bold mb-4">Find your next gig fast</h1>
      <p className="text-lg text-gray-600 mb-8">Search thousands of flexible jobs.</p>
      <Link data-testid="hero-start" href={hostAware("/browse-jobs")} className="btn btn-primary">
        Get started
      </Link>
    </section>
  );
}

