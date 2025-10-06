import { Metadata } from 'next';
import CreateGigForm from './CreateGigForm';

export const metadata: Metadata = {
  title: 'Post a Job - QuickGig',
  description: 'Post a job and find qualified candidates in the Philippines',
};

export default function CreateGigPage() {
  // Demo user with default values
  const demoUser = { id: 'demo-user' };
  const userTickets = 3; // Default tickets

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Post a Job</h1>
        <p className="text-gray-600 mb-8">
          Find qualified candidates for your project or business needs.
        </p>
        <CreateGigForm userId={demoUser.id} userTickets={userTickets} />
      </div>
    </main>
  );
}
