import { redirect } from 'next/navigation';

export default function AppHome() {
  // Hard redirect prevents any accidental marketing hero bleed.
  redirect('/find');
}
