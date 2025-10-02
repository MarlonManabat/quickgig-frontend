import { Metadata } from 'next';
import { requireUser } from '@/lib/auth/requireUser';
import MessagesClient from './MessagesClient';

export const metadata: Metadata = {
  title: 'Messages - QuickGig',
  description: 'Communicate with employers and job seekers',
};

export default async function MessagesPage() {
  const user = await requireUser();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Messages</h1>
      <MessagesClient userId={user.id} />
    </div>
  );
}
