import LinkSafe from '@/components/LinkSafe';

export default function NotFound() {
  return (
    <div className="py-20 text-center space-y-4">
      <h1 className="text-3xl font-extrabold">Hindi makita ang page</h1>
      <LinkSafe href="/find" className="text-link underline">
        Bumalik sa Hanap Trabaho
      </LinkSafe>
    </div>
  );
}
