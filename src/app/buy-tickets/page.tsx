import Checkout from '@/components/payments/Checkout';
import { flags } from '@/lib/flags';

export default function BuyTicketsPage() {
  if (!flags.payments) {
    return <main className="p-4">Payments disabled</main>;
  }
  return (
    <main className="p-4 space-y-4">
      <h1 className="text-xl font-semibold">Buy Tickets</h1>
      <Checkout amount={100} />
    </main>
  );
}

