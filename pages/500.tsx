import LinkSafe from '@/components/LinkSafe';
import Container from '@/components/Container';
import { H1 } from '@/components/ui/Text';

export default function FiveHundred() {
  return (
    <Container className="py-20 text-center space-y-4">
      <H1>May problema sa server</H1>
      <LinkSafe href="/find" className="text-link underline">
        Bumalik sa Hanap Trabaho
      </LinkSafe>
    </Container>
  );
}
