import { redirect } from 'next/navigation';

export default function Root() {
  redirect('/browse-jobs');
  // Fallback for build environments where redirect might not throw
  return null;
}
