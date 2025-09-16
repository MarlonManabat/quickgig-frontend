import { redirect } from 'next/navigation';
import { authAware } from '@/lib/hostAware';

export default function PostJobRedirect() {
  redirect(authAware('/gigs/create'));
}

