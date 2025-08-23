import LinkSafe from '@/components/LinkSafe';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-hero text-white text-center p-4">
      <h1 className="text-4xl font-bold mb-4">Hindi makita ang page</h1>
      <LinkSafe
        href="/gigs"
        className="underline text-xl"
      >
        Bumalik sa Hanap Trabaho
      </LinkSafe>
    </div>
  );
}
