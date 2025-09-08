import Container from "./Container";
import LandingCTAs from "@/components/landing/LandingCTAs";

export default function Footer() {
  return (
    <footer className="qg-footer border-t border-brand-border">
      <Container className="py-6 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} QuickGig
        </p>
        <LandingCTAs
          startClassName="hover:underline text-sm"
          postClassName="hover:underline text-sm"
        />
      </Container>
    </footer>
  );
}
