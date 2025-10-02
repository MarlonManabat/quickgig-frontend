import { Metadata } from 'next';
import { requireUser } from '@/lib/auth/requireUser';
import CreateGigForm from './CreateGigForm';

export const metadata: Metadata = {
  title: 'Post a Job - QuickGig',
  description: 'Post a job and find qualified candidates in the Philippines',
};

export default async function CreateGigPage() {
  const user = await requireUser();
  
  // Get user's ticket balance
  let userTickets = 3; // Default
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/tickets/balance`, {
      headers: {
        'Cookie': `auth=${user.id}` // Simplified for demo
      }
    });
    if (response.ok) {
      const data = await response.json();
      userTickets = data.balance || 3;
    }
  } catch (error) {
    console.error('Failed to fetch ticket balance:', error);
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Post a Job</h1>
        <p className="text-gray-600 mb-8">
          Find qualified candidates for your project or business needs.
        </p>
        <CreateGigForm userId={user.id} userTickets={userTickets} />
      </div>
    </main>
  );
}
