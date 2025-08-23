import LinkSafe from '@/components/LinkSafe';
import { H1 } from '@/components/ui/Text';

export default function NotFound() {
  return (
    <div className="py-20 text-center space-y-4">
      <H1>Hindi makita ang page</H1>
      <LinkSafe href="/find" className="text-link underline">
        Bumalik sa Hanap Trabaho
      </LinkSafe>
    </div>
  );
}
